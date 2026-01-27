import prisma from '../../config/prisma.js'
import { requireStudent } from '../../utils/studentUtils.js'
import logger from '../../utils/logger.js'

export const getDashboardStats = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const [totalOpportunities, totalApplied, totalRejected] = await Promise.all([
      prisma.opportunity.count(),
      prisma.application.count({
        where: {
          studentId: student.id,
          status: {
            notIn: ['rejected', 'withdrawn']
          }
        }
      }),
      prisma.application.count({
        where: {
          studentId: student.id,
          status: 'rejected'
        }
      })
    ])

    return res.status(200).json({
      status: 'success',
      data: {
        totalOpportunities,
        totalApplied,
        totalRejected
      }
    })
  } catch (error) {
    logger.error('get_student_dashboard_stats_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard stats'
    })
  }
}

