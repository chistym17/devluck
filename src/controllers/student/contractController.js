import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent } from '../../utils/studentUtils.js'

export const listContracts = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const status = req.query.status

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = {
      studentId: student.id,
      ...(status && { status })
    }

    const [items, total] = await Promise.all([
      prisma.contract.findMany({
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
          }
        },
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contract.count({ where })
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
    logger.error('list_student_contracts_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list contracts'
    })
  }
}

export const getContractById = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const contract = await prisma.contract.findUnique({
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
        opportunity: {
          select: {
            id: true,
            title: true,
            details: true,
            skills: true,
            benefits: true,
            keyResponsibilities: true,
            whyYouWillLoveWorkingHere: true,
            location: true,
            type: true,
            timeLength: true,
            currency: true,
            allowance: true
          }
        }
      }
    })

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Contract not found'
      })
    }

    if (contract.studentId !== student.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This contract does not belong to you.'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: contract
    })
  } catch (error) {
    logger.error('get_student_contract_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get contract'
    })
  }
}

