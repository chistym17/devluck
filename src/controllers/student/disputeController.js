import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { createNotification } from '../../utils/notificationService.js'
import { getStudentFromUser } from '../../utils/studentUtils.js'

// Student creates a dispute for their contract
export const createDispute = async (req, res) => {
  try {
    const student = await getStudentFromUser(req.user.id)
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      })
    }

    const { contractId } = req.params
    const { reason, note } = req.body

    // Validation
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Dispute reason is required'
      })
    }

    // Verify contract exists and belongs to student
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            userId: true
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

    // Check for existing open dispute
    const existingDispute = await prisma.dispute.findFirst({
      where: {
        contractId,
        status: { in: ['Open', 'UnderReview'] }
      }
    })

    if (existingDispute) {
      return res.status(400).json({
        status: 'error',
        message: 'There is already an open dispute for this contract'
      })
    }

    // Create dispute and update contract status in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the dispute
      const dispute = await tx.dispute.create({
        data: {
          contractId,
          studentId: student.id,
          companyId: contract.companyId,
          reason: reason.trim(),
          note: note?.trim() || null,
          status: 'Open'
        },
        include: {
          contract: {
            select: {
              contractTitle: true,
              inContractNumber: true
            }
          }
        }
      })

      // Update contract status to Disputed
      await tx.contract.update({
        where: { id: contractId },
        data: { status: 'Disputed' }
      })

      return dispute
    })

    // Send notification to company
    try {
      await createNotification({
        userId: contract.company.userId,
        type: 'CONTRACT_DISPUTE',
        title: 'Contract Dispute Filed',
        message: `${student.name} has filed a dispute for contract "${result.contract.contractTitle}" (${result.contract.inContractNumber}). Reason: ${reason}`,
        metadata: {
          disputeId: result.id,
          contractId,
          studentId: student.id,
          studentName: student.name
        }
      })
    } catch (notifError) {
      logger.error('dispute_notification_error', { error: notifError.message })
    }

    logger.info('dispute_created', {
      disputeId: result.id,
      contractId,
      studentId: student.id,
      companyId: contract.companyId
    })

    return res.status(201).json({
      status: 'success',
      data: result,
      message: 'Dispute filed successfully. The company will be notified.'
    })
  } catch (error) {
    logger.error('create_dispute_error', { error: error.message, stack: error.stack })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create dispute'
    })
  }
}

// Student lists their disputes
export const listDisputes = async (req, res) => {
  try {
    const student = await getStudentFromUser(req.user.id)
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      })
    }

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const status = req.query.status // Filter by status if provided

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = {
      studentId: student.id,
      ...(status && { status })
    }

    const [items, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        include: {
          contract: {
            select: {
              id: true,
              contractTitle: true,
              inContractNumber: true,
              status: true
            }
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        },
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.dispute.count({ where })
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
    logger.error('list_student_disputes_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list disputes'
    })
  }
}

// Student gets a specific dispute by ID
export const getDisputeById = async (req, res) => {
  try {
    const student = await getStudentFromUser(req.user.id)
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      })
    }

    const { id } = req.params

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        contract: {
          select: {
            id: true,
            contractTitle: true,
            inContractNumber: true,
            status: true,
            duration: true,
            monthlyAllowance: true,
            currency: true,
            workLocation: true
          }
        },
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
    })

    if (!dispute) {
      return res.status(404).json({
        status: 'error',
        message: 'Dispute not found'
      })
    }

    if (dispute.studentId !== student.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This dispute does not belong to you.'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: dispute
    })
  } catch (error) {
    logger.error('get_student_dispute_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get dispute'
    })
  }
}

