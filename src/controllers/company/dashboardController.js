import prisma from '../../config/prisma.js'
import { requireCompany } from '../../utils/companyUtils.js'
import logger from '../../utils/logger.js'

export const getDashboardStats = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const [opportunitiesCount, contractsCount, paymentsCount] = await Promise.all([
      prisma.opportunity.count({ where: { companyId: company.id } }),
      prisma.contract.count({ where: { companyId: company.id } }),
      prisma.payment.count({ where: { companyId: company.id } })
    ])

    return res.status(200).json({
      totalSales: paymentsCount,
      newUsers: 0,
      revenue: paymentsCount,
      opportunities: opportunitiesCount
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to get dashboard stats'
    })
  }
}

export const getDashboardRecentApplicants = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const limit = parseInt(req.query.limit, 10) || 5
    const safeLimit = limit < 1 ? 5 : Math.min(limit, 20)

    const applications = await prisma.application.findMany({
      where: {
        opportunity: {
          companyId: company.id
        }
      },
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
            image: true
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
      take: safeLimit,
      orderBy: { appliedAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: {
        items: applications,
        limit: safeLimit
      }
    })
  } catch (error) {
    logger.error('get_dashboard_recent_applicants_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get recent applicants'
    })
  }
}


