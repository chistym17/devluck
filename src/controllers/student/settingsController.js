import bcrypt from 'bcryptjs'
import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent } from '../../utils/studentUtils.js'
import { createNotification } from '../../utils/notificationService.js'

export const getSettings = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    let settings = await prisma.studentSettings.findUnique({
      where: { studentId: student.id }
    })

    if (!settings) {
      settings = await prisma.studentSettings.create({
        data: {
          studentId: student.id,
          theme: 'light',
          themeColor: '#FFEB9C'
        }
      })
    }

    return res.status(200).json({
      status: 'success',
      data: {
        theme: settings.theme,
        themeColor: settings.themeColor
      }
    })
  } catch (error) {
    logger.error('get_settings_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get settings' })
  }
}

export const updateSettings = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { theme, themeColor } = req.body

    const updateData = {}
    if (theme !== undefined) updateData.theme = theme
    if (themeColor !== undefined) updateData.themeColor = themeColor

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: 'No fields to update' })
    }

    const settings = await prisma.studentSettings.upsert({
      where: { studentId: student.id },
      update: updateData,
      create: {
        studentId: student.id,
        theme: theme || 'light',
        themeColor: themeColor || '#FFEB9C'
      }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully',
      data: {
        theme: settings.theme,
        themeColor: settings.themeColor
      }
    })
  } catch (error) {
    logger.error('update_settings_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to update settings' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ status: 'error', message: 'currentPassword, newPassword, and confirmPassword are required' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ status: 'error', message: 'New password and confirm password do not match' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ status: 'error', message: 'New password must be at least 6 characters long' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    })

    createNotification({
      userId: req.user.id,
      type: 'PASSWORD_CHANGED',
      title: 'Password changed',
      message: 'Your password was changed successfully. If this wasn\'t you, please secure your account immediately.'
    }).catch(error => {
      logger.error('password_change_notification_error', { error: error.message })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    })
  } catch (error) {
    logger.error('change_password_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to change password' })
  }
}

