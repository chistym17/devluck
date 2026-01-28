import prisma from '../../config/prisma.js'
import { requireCompany } from '../../utils/companyUtils.js'
import logger from '../../utils/logger.js'
import { createNotification } from '../../utils/notificationService.js'

export const listPayments = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const search = req.query.search || ''
    const status = req.query.status
    const contractId = req.query.contractId

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const searchTerm = search.trim()
    const isIdLike = searchTerm.length >= 8 && /^[a-zA-Z0-9-]+$/.test(searchTerm)

    const where = {
      companyId: company.id,
      ...(contractId && { contractId: contractId }),
      ...(searchTerm && {
        OR: [
          ...(isIdLike ? [
            { contractId: { equals: searchTerm, mode: 'insensitive' } },
            { transferId: { equals: searchTerm, mode: 'insensitive' } }
          ] : [
            { transferId: { contains: searchTerm, mode: 'insensitive' } }
          ]),
          { applicantName: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }),
      ...(status && { paymentStatus: status })
    }

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
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
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list payments'
    })
  }
}

export const createPayment = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const {
      applicantName,
      studentId,
      contractId,
      nextPayment,
      monthlyAllowance,
      note,
      paymentStatus
    } = req.body

    if (!applicantName || !nextPayment || !monthlyAllowance || !paymentStatus) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        requiredFields: ['applicantName', 'nextPayment', 'monthlyAllowance', 'paymentStatus']
      })
    }

    let resolvedStudentId = studentId || null

    if (!resolvedStudentId && contractId) {
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        select: { studentId: true }
      })
      if (contract && contract.studentId) {
        resolvedStudentId = contract.studentId
      }
    }

    const transferId = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const payment = await prisma.payment.create({
      data: {
        applicantId: null,
        applicantName,
        studentId: resolvedStudentId,
        contractId: contractId || null,
        transferId,
        nextPayment,
        monthlyAllowance,
        workLocation: null,
        method: null,
        note: note || null,
        paymentStatus,
        companyId: company.id
      }
    })

    if (resolvedStudentId) {
      prisma.student
        .findUnique({
          where: { id: resolvedStudentId },
          select: { userId: true }
        })
        .then(student => {
          if (!student || !student.userId) return
          return createNotification({
            userId: student.userId,
            type: 'PAYMENT_CREATED',
            title: 'New payment created',
            message: `A payment of ${monthlyAllowance} has been created for you (Status: ${paymentStatus})`
          })
        })
        .catch(error => {
          logger.error('create_payment_notification_error', { error: error.message })
        })
    }

    return res.status(201).json({
      status: 'success',
      data: payment
    })
  } catch (error) {
    logger.error('create_payment_error', {
      error: error.message,
      stack: error.stack,
      body: req.body
    })
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create payment'
    })
  }
}

export const updatePayment = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const {
      applicantName,
      studentId,
      contractId,
      nextPayment,
      monthlyAllowance,
      note,
      paymentStatus
    } = req.body

    const payment = await prisma.payment.findUnique({
      where: { id }
    })

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      })
    }

    if (payment.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not own this payment'
      })
    }

    if (!applicantName || !nextPayment || !monthlyAllowance || !paymentStatus) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        requiredFields: ['applicantName', 'nextPayment', 'monthlyAllowance', 'paymentStatus']
      })
    }

    let resolvedStudentId = studentId

    if (!resolvedStudentId && contractId) {
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        select: { studentId: true }
      })
      if (contract && contract.studentId) {
        resolvedStudentId = contract.studentId
      }
    }

    const updateData = {
      applicantName,
      contractId: contractId || null,
      nextPayment,
      monthlyAllowance,
      note: note || null,
      paymentStatus
    }

    if (resolvedStudentId !== undefined) {
      updateData.studentId = resolvedStudentId
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: updateData
    })

    const finalStudentId = resolvedStudentId || payment.studentId
    if (finalStudentId && paymentStatus !== payment.paymentStatus) {
      prisma.user
        .findFirst({
          where: { studentId: finalStudentId },
          select: { id: true }
        })
        .then(user => {
          if (!user) return
          return createNotification({
            userId: user.id,
            type: 'PAYMENT_STATUS_UPDATED',
            title: 'Payment status updated',
            message: `Your payment status has been updated to "${paymentStatus}"${monthlyAllowance ? ` (Amount: ${monthlyAllowance})` : ''}`
          })
        })
        .catch(error => {
          logger.error('update_payment_notification_error', { error: error.message })
        })
    }

    return res.status(200).json({
      status: 'success',
      data: updatedPayment
    })
  } catch (error) {
    logger.error('update_payment_error', {
      error: error.message,
      stack: error.stack,
      paymentId: req.params.id,
      body: req.body
    })
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update payment'
    })
  }
}

export const deletePayment = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const payment = await prisma.payment.findUnique({
      where: { id }
    })

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      })
    }

    if (payment.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not own this payment'
      })
    }

    await prisma.payment.delete({
      where: { id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Payment deleted successfully'
    })
  } catch (error) {
    logger.error('delete_payment_error', {
      error: error.message,
      stack: error.stack,
      paymentId: req.params.id
    })
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete payment'
    })
  }
}

export const getPaymentStats = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const contractId = req.query.contractId

    if (!contractId) {
      return res.status(400).json({
        status: 'error',
        message: 'Contract ID is required'
      })
    }

    const where = {
      companyId: company.id,
      contractId: contractId
    }

    // Get all payments for this contract to calculate stats
    const payments = await prisma.payment.findMany({
      where,
      select: {
        monthlyAllowance: true,
        paymentStatus: true
      }
    })

    // Calculate stats efficiently
    let totalPaid = 0
    let totalPaidCount = 0
    let totalPending = 0
    let totalPendingCount = 0
    let totalDue = 0
    let totalDueCount = 0

    payments.forEach((payment) => {
      const amount = parseFloat(payment.monthlyAllowance) || 0
      const status = (payment.paymentStatus || '').trim()

      if (status === 'Paid') {
        totalPaid += amount
        totalPaidCount++
      } else if (status === 'Pending') {
        totalPending += amount
        totalPendingCount++
      } else if (status === 'Due') {
        totalDue += amount
        totalDueCount++
      }
    })

    return res.status(200).json({
      status: 'success',
      data: {
        totalPaid: {
          amount: totalPaid,
          count: totalPaidCount
        },
        pending: {
          amount: totalPending,
          count: totalPendingCount
        },
        due: {
          amount: totalDue,
          count: totalDueCount
        }
      }
    })
  } catch (error) {
    logger.error('get_payment_stats_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get payment statistics'
    })
  }
}


