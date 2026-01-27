import prisma from '../config/prisma.js'
import logger from './logger.js'

export const createNotification = async ({ userId, type, title, message, metadata }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata: metadata ?? null
      }
    })

    return notification
  } catch (error) {
    logger.error('create_notification_error', {
      error: error.message,
      userId,
      type
    })
    throw error
  }
}


