import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany, checkResourceOwnership } from '../../utils/companyUtils.js'

export const getApplicationsForOpportunity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { opportunityId } = req.params
    const { page = 1, limit = 10, status } = req.query

    const safePage = parseInt(page, 10) || 1
    const safeLimit = parseInt(limit, 10) || 10
    const skip = (safePage - 1) * safeLimit

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    })

    const ownershipCheck = checkResourceOwnership(opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const where = {
      opportunityId,
      ...(status && { status })
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              availability: true,
              profileRanking: true,
              profileComplete: true,
              email: true,
              salaryExpectation: true
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
    logger.error('get_applications_for_opportunity_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get applications' })
  }
}

export const getAllApplications = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { page = 1, limit = 10, status, opportunityId } = req.query

    const safePage = parseInt(page, 10) || 1
    const safeLimit = parseInt(limit, 10) || 10
    const skip = (safePage - 1) * safeLimit

    const where = {
      opportunity: {
        companyId: company.id
      },
      ...(status && { status }),
      ...(opportunityId && { opportunityId })
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              availability: true,
              profileRanking: true,
              profileComplete: true,
              email: true,
              salaryExpectation: true
            }
          },
          opportunity: {
            select: {
              id: true,
              title: true,
              type: true
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
    logger.error('get_all_applications_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get applications' })
  }
}

export const getApplicationById = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const includeFullProfile = req.query.fullProfile === 'true'

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        student: includeFullProfile ? {
          include: {
            skills: {
              include: {
                skill: true
              }
            },
            experiences: true,
            educations: true,
            languages: true,
            portfolios: true
          }
        } : {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            availability: true,
            profileRanking: true,
            profileComplete: true
          }
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            type: true,
            companyId: true
          }
        }
      }
    })

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      })
    }

    if (!application.opportunity) {
      return res.status(404).json({
        status: 'error',
        message: 'Opportunity not found'
      })
    }

    if (application.opportunity.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not own this opportunity'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: application
    })
  } catch (error) {
    logger.error('get_application_by_id_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get application' })
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required'
      })
    }

    const validStatuses = ['pending', 'accepted', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

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

    const ownershipCheck = checkResourceOwnership(application.opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            availability: true,
            profileRanking: true,
            profileComplete: true,
            email: true,
            salaryExpectation: true
          }
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Application status updated successfully',
      data: updatedApplication
    })
  } catch (error) {
    logger.error('update_application_status_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to update application status' })
  }
}

export const deleteApplication = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

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

    const ownershipCheck = checkResourceOwnership(application.opportunity, company.id, 'Opportunity')
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

export const getStudentProfileByStudentId = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { studentId } = req.params
    const includeFullProfile = req.query.fullProfile === 'true'

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: includeFullProfile ? {
        skills: {
          include: {
            skill: true
          }
        },
        experiences: true,
        educations: true,
        languages: true,
        portfolios: true
      } : {
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: student
    })
  } catch (error) {
    logger.error('get_student_profile_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get student profile' })
  }
}

export const searchUserByEmail = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { email } = req.query

    if (!email || !email.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      })
    }

    const emailQuery = email.trim().toLowerCase()

    // Search for users with email starting with the query (for autocomplete)
    const users = await prisma.user.findMany({
      where: {
        email: {
          startsWith: emailQuery,
          mode: 'insensitive'
        },
        role: 'STUDENT'
      },
      include: {
        student: true
      },
      take: 20,
      orderBy: {
        email: 'asc'
      }
    })

    // Filter to only include users with student profiles
    const validStudents = users
      .filter(user => user.student !== null)
      .map(user => ({
        email: user.email,
        id: user.id,
        name: user.student?.name || ''
      }))

    return res.status(200).json({
      status: 'success',
      data: validStudents
    })
  } catch (error) {
    logger.error('search_user_by_email_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to search user by email' })
  }
}

