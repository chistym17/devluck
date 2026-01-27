import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, checkResourceOwnership } from '../../utils/studentUtils.js'
import { createNotification } from '../../utils/notificationService.js'

export const createApplication = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { opportunityId, answers } = req.body

    if (!opportunityId) {
      return res.status(400).json({ status: 'error', message: 'opportunityId is required' })
    }

    const studentData = await prisma.student.findUnique({
      where: { id: student.id },
      select: {
        email: true,
        salaryExpectation: true
      }
    })

    if (!studentData) {
      return res.status(404).json({ status: 'error', message: 'Student profile not found' })
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        questions: {
          where: { isRequired: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!opportunity) {
      return res.status(404).json({ status: 'error', message: 'Opportunity not found' })
    }

    if (answers && Array.isArray(answers)) {
      const requiredQuestions = opportunity.questions.map(q => q.id)
      const answeredQuestionIds = answers.map(a => a.questionId).filter(Boolean)
      const missingRequired = requiredQuestions.filter(qId => !answeredQuestionIds.includes(qId))
      
      if (missingRequired.length > 0) {
        const missingQuestions = await prisma.question.findMany({
          where: { id: { in: missingRequired } },
          select: { question: true }
        })
        return res.status(400).json({
          status: 'error',
          message: 'All required questions must be answered',
          missingQuestions: missingQuestions.map(q => q.question)
        })
      }

      for (const answer of answers) {
        if (!answer.questionId || answer.answer === undefined || answer.answer === null || answer.answer === '') {
          const question = await prisma.question.findUnique({
            where: { id: answer.questionId },
            select: { question: true, isRequired: true }
          })
          if (question && question.isRequired) {
            return res.status(400).json({
              status: 'error',
              message: `Required question "${question.question}" must be answered`
            })
          }
        }
      }
    }

    const applicationData = {
      studentId: student.id,
      opportunityId,
      status: 'pending',
      applicantEmail: studentData.email || null,
      salaryExpectation: studentData.salaryExpectation || null,
      answers: answers && Array.isArray(answers) ? {
        create: answers.map(a => ({
          questionId: a.questionId,
          answer: Array.isArray(a.answer) ? a.answer.join(',') : String(a.answer)
        }))
      } : undefined
    }

    const [application] = await prisma.$transaction([
      prisma.application.create({
        data: applicationData,
      include: { opportunity: true }
      }),
      prisma.opportunity.update({
        where: { id: opportunityId },
        data: {
          applicantCount: {
            increment: 1
          }
        }
      })
    ])

    if (application.opportunity && application.opportunity.companyId) {
      prisma.company
        .findUnique({
          where: { id: application.opportunity.companyId },
          select: {
            id: true,
            userId: true
          }
        })
        .then((company) => {
          if (!company || !company.userId) return
          return createNotification({
            userId: company.userId,
            type: 'APPLICATION_SUBMITTED',
            title: 'New application received',
            message: `${student.name} applied for ${application.opportunity.title}`
          })
        })
        .catch((notificationError) => {
          logger.error('create_application_notification_error', {
            error: notificationError.message
          })
        })
    }

    return res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: application
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ status: 'error', message: 'Already applied to this opportunity' })
    }
    logger.error('create_application_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to create application' })
  }
}

export const getApplications = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { page = 1, limit = 10, status } = req.query

    const safePage = parseInt(page, 10) || 1
    const safeLimit = parseInt(limit, 10) || 10
    const skip = (safePage - 1) * safeLimit

    const where = {
      studentId: student.id,
      ...(status && { status })
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { 
          opportunity: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  industry: true,
                  location: true
                }
              }
            }
          }
        },
        skip,
        take: safeLimit,
        orderBy: { appliedAt: 'desc' }
      }),
      prisma.application.count({ where })
    ])

    return res.status(200).json({
      status: 'success',
      data: {
        items: applications,
        total,
        page: safePage,
        pageSize: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    })
  } catch (error) {
    logger.error('get_applications_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get applications' })
  }
}

export const checkApplicationExists = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { opportunityId } = req.params

    if (!opportunityId) {
      return res.status(400).json({
        status: 'error',
        message: 'Opportunity ID is required'
      })
    }

    const application = await prisma.application.findFirst({
      where: {
        studentId: student.id,
        opportunityId: opportunityId
      }
    })

    return res.status(200).json({
      status: 'success',
      data: {
        hasApplied: !!application
      }
    })
  } catch (error) {
    logger.error('check_application_exists_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to check application' })
  }
}

export const getApplication = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const application = await prisma.application.findUnique({
      where: { id },
      include: { opportunity: true }
    })

    const ownershipCheck = checkResourceOwnership(application, student.id, 'Application')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({ status: 'success', data: application })
  } catch (error) {
    logger.error('get_application_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get application' })
  }
}

export const withdrawApplication = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        opportunity: true
      }
    })

    const ownershipCheck = checkResourceOwnership(application, student.id, 'Application')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ status: 'error', message: 'Can only withdraw pending applications' })
    }

    await prisma.$transaction([
      prisma.application.delete({
        where: { id }
      }),
      prisma.opportunity.update({
        where: { id: application.opportunityId },
        data: {
          applicantCount: {
            decrement: 1
          }
        }
      })
    ])

    if (application.opportunity && application.opportunity.companyId) {
      prisma.company
        .findUnique({
          where: { id: application.opportunity.companyId },
          select: {
            id: true,
            userId: true
          }
        })
        .then((company) => {
          if (!company || !company.userId) return
          return createNotification({
            userId: company.userId,
            type: 'APPLICATION_WITHDRAWN',
            title: 'Application withdrawn',
            message: `${student.name} withdrew their application for ${application.opportunity.title}`
          })
        })
        .catch((notificationError) => {
          logger.error('withdraw_application_notification_error', {
            error: notificationError.message
          })
        })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Application withdrawn and deleted successfully'
    })
  } catch (error) {
    logger.error('withdraw_application_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to withdraw application' })
  }
}

export const deleteApplication = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        opportunity: true
      }
    })

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      })
    }

    const ownershipCheck = checkResourceOwnership(application, student.id, 'Application')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.$transaction([
      prisma.application.delete({
        where: { id }
      }),
      prisma.opportunity.update({
        where: { id: application.opportunityId },
        data: {
          applicantCount: {
            decrement: 1
          }
        }
      })
    ])

    return res.status(200).json({
      status: 'success',
      message: 'Application deleted successfully'
    })
  } catch (error) {
    logger.error('delete_application_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to delete application' })
  }
}

