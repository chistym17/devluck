import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent } from '../../utils/studentUtils.js'

export const getOpportunityQuestions = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { opportunityId } = req.params

    if (!opportunityId) {
      return res.status(400).json({
        status: 'error',
        message: 'opportunityId is required'
      })
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    })

    if (!opportunity) {
      return res.status(404).json({
        status: 'error',
        message: 'Opportunity not found'
      })
    }

    const questions = await prisma.question.findMany({
      where: { opportunityId },
      orderBy: { order: 'asc' }
    })

    return res.status(200).json({
      status: 'success',
      data: questions
    })
  } catch (error) {
    logger.error('get_opportunity_questions_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get questions'
    })
  }
}

export const listAllOpportunities = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const excludeApplied = req.query.excludeApplied === 'true'

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = excludeApplied ? {
      applications: {
        none: {
          studentId: student.id
        }
      }
    } : {}

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              industry: true,
              location: true
            }
          },
          applications: {
            where: {
              studentId: student.id
            },
            select: {
              id: true,
              status: true,
              appliedAt: true
            },
            take: 1
          }
        },
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.opportunity.count({ where })
    ])

    const items = opportunities.map(opportunity => {
      const application = opportunity.applications[0] || null
      const { applications, ...opportunityData } = opportunity
      
      return {
        ...opportunityData,
        company: opportunityData.company ? { ...opportunityData.company, logoUrl: opportunityData.company.logo } : null,
        applicationStatus: application ? {
          status: application.status,
          applicationId: application.id,
          appliedAt: application.appliedAt
        } : null
      }
    })

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
    logger.error('list_all_opportunities_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list opportunities'
    })
  }
}

export const getOpportunityById = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            location: true,
            website: true,
            description: true
          }
        },
        applications: {
          where: {
            studentId: student.id
          },
          select: {
            id: true,
            status: true,
            appliedAt: true
          },
          take: 1
        }
      }
    })

    if (!opportunity) {
      return res.status(404).json({
        status: 'error',
        message: 'Opportunity not found'
      })
    }

    const application = opportunity.applications[0] || null
    const { applications, ...opportunityData } = opportunity

    const response = {
      ...opportunityData,
      company: opportunityData.company ? { ...opportunityData.company, logoUrl: opportunityData.company.logo } : null,
      applicationStatus: application ? {
        status: application.status,
        applicationId: application.id,
        appliedAt: application.appliedAt
      } : null
    }

    return res.status(200).json({
      status: 'success',
      data: response
    })
  } catch (error) {
    logger.error('get_opportunity_by_id_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get opportunity'
    })
  }
}

