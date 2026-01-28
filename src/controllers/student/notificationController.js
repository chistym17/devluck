import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent } from '../../utils/studentUtils.js'

export const listNotifications = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const read = req.query.read

    const safePage = page < 1 ? 1 : page
    const safeLimit = limit < 1 ? 10 : Math.min(limit, 50)
    const skip = (safePage - 1) * safeLimit

    if (!student.userId) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    const where = {
      userId: student.userId,
      ...(read !== undefined && { read: read === 'true' })
    }

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ])

    return res.status(200).json({
      status: 'success',
      data: {
        items,
        total,
        page: safePage,
        pageSize: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    })
  } catch (error) {
    logger.error('list_notifications_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list notifications'
    })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    if (!student.userId) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    const notification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      })
    }

    if (notification.userId !== student.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This notification does not belong to you.'
      })
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
      data: updatedNotification
    })
  } catch (error) {
    logger.error('mark_notification_read_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read'
    })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    if (!student.userId) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    await prisma.notification.updateMany({
      where: {
        userId: student.userId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    })
  } catch (error) {
    logger.error('mark_all_notifications_read_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to mark all notifications as read'
    })
  }
}

