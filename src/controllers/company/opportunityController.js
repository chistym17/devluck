import prisma from '../../config/prisma.js'
import { requireCompany, checkResourceOwnership } from '../../utils/companyUtils.js'
import { createNotification } from '../../utils/notificationService.js'
import logger from '../../utils/logger.js'

export const createOpportunity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const {
      title,
      type,
      timeLength,
      currency,
      allowance,
      location,
      details,
      description,
      skills,
      whyYouWillLoveWorkingHere,
      benefits,
      keyResponsibilities,
      startDate
    } = req.body

    if (!title || !type || !timeLength || !currency || (!details && !description)) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        requiredFields: ['title', 'type', 'timeLength', 'currency', 'details or description']
      })
    }

    const parsedStartDate = startDate ? new Date(startDate) : null

    if (startDate && Number.isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid startDate format'
      })
    }

    const dataToSave = {
      title,
      type,
      timeLength,
      currency,
      allowance: allowance || null,
      location: location || null,
      details: details || description || '',
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      whyYouWillLoveWorkingHere: Array.isArray(whyYouWillLoveWorkingHere) ? whyYouWillLoveWorkingHere : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      keyResponsibilities: Array.isArray(keyResponsibilities) ? keyResponsibilities : [],
      startDate: parsedStartDate,
      companyId: company.id
    }

    const opportunity = await prisma.opportunity.create({
      data: dataToSave
    })
    return res.status(201).json({
      status: 'success',
      data: opportunity
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create opportunity'
    })
  }
}

export const updateOpportunity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const {
      title,
      type,
      timeLength,
      currency,
      allowance,
      location,
      details,
      description,
      skills,
      whyYouWillLoveWorkingHere,
      benefits,
      keyResponsibilities,
      startDate
    } = req.body

    const exists = await prisma.opportunity.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(exists, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const parsedStartDate = startDate ? new Date(startDate) : undefined

    if (startDate && Number.isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid startDate format'
      })
    }

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: {
        title: title !== undefined ? title : exists.title,
        type: type !== undefined ? type : exists.type,
        timeLength: timeLength !== undefined ? timeLength : exists.timeLength,
        currency: currency !== undefined ? currency : exists.currency,
        allowance: allowance !== undefined ? allowance : exists.allowance,
        location: location !== undefined ? location : exists.location,
        details: details !== undefined || description !== undefined ? (details || description || exists.details) : exists.details,
        skills: skills !== undefined ? (Array.isArray(skills) ? skills : [skills]) : exists.skills,
        whyYouWillLoveWorkingHere: whyYouWillLoveWorkingHere !== undefined ? (Array.isArray(whyYouWillLoveWorkingHere) ? whyYouWillLoveWorkingHere : []) : exists.whyYouWillLoveWorkingHere,
        benefits: benefits !== undefined ? (Array.isArray(benefits) ? benefits : []) : exists.benefits,
        keyResponsibilities: keyResponsibilities !== undefined ? (Array.isArray(keyResponsibilities) ? keyResponsibilities : []) : exists.keyResponsibilities,
        startDate: parsedStartDate !== undefined ? parsedStartDate : exists.startDate
      }
    })

    return res.status(200).json({
      status: 'success',
      data: opportunity
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update opportunity'
    })
  }
}

export const listOpportunities = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = {
      companyId: company.id
    }

    const [items, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.opportunity.count({ where })
    ])

    return res.status(200).json({
      status: 'success',
      data: {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages: Math.ceil(total / safePageSize) || 1
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list opportunities'
    })
  }
}

export const getOpportunityById = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const opportunity = await prisma.opportunity.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({
      status: 'success',
      data: opportunity
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get opportunity'
    })
  }
}

export const getRecentOpportunities = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const limit = parseInt(req.query.limit, 10) || 5
    const safeLimit = limit < 1 ? 5 : Math.min(limit, 20)

    const items = await prisma.opportunity.findMany({
      where: {
        companyId: company.id
      },
      take: safeLimit,
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: {
      items,
      limit: safeLimit
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get recent opportunities'
    })
  }
}

export const deleteOpportunity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const exists = await prisma.opportunity.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(exists, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const applications = await prisma.application.findMany({
      where: { opportunityId: id },
      include: {
        student: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    })

    await prisma.opportunity.delete({
      where: { id }
    })

    const notificationPromises = applications
      .filter(app => app.student && app.student.userId)
      .map(app => 
        createNotification({
          userId: app.student.userId,
          type: 'OPPORTUNITY_DELETED',
          title: 'Opportunity removed',
          message: `The opportunity "${exists.title}" you applied for has been removed by the company.`
        }).catch(error => {
          logger.error('opportunity_deletion_notification_error', {
            error: error.message,
            applicationId: app.id
          })
        })
      )

    Promise.all(notificationPromises).catch(error => {
      logger.error('opportunity_deletion_notifications_batch_error', {
        error: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Opportunity deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete opportunity'
    })
  }
}




