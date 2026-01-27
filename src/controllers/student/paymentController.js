import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent } from '../../utils/studentUtils.js'

export const listPayments = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const contractId = req.query.contractId

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = {
      studentId: student.id,
      ...(contractId && { contractId: contractId })
    }

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          contract: {
            select: {
              id: true,
              contractTitle: true,
              inContractNumber: true
            }
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
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
    logger.error('list_student_payments_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list payments'
    })
  }
}

