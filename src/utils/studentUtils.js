import prisma from '../config/prisma.js'
import { createNotification } from './notificationService.js'
import logger from './logger.js'

export const getStudentFromUser = async (userId) => {
  const student = await prisma.student.findUnique({
    where: { userId }
  })
  return student
}

export const requireStudent = async (req, res) => {
  const student = await getStudentFromUser(req.user.id)
  if (!student) {
    res.status(404).json({
      status: 'error',
      message: 'Student profile not found'
    })
    return null
  }
  return student
}

export const checkResourceOwnership = (resource, studentId, resourceName = 'Resource') => {
  if (!resource) {
    return {
      error: {
        status: 404,
        message: `${resourceName} not found`
      }
    }
  }

  if (resource.studentId !== studentId) {
    return {
      error: {
        status: 403,
        message: `Access denied. You do not own this ${resourceName.toLowerCase()}`
      }
    }
  }

  return { error: null }
}

export const calculateProfileComplete = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      name: true,
      description: true,
      _count: {
        select: {
          skills: true,
          experiences: true,
          educations: true,
          languages: true,
          portfolios: true,
          addresses: true
        }
      }
    }
  })

  if (!student) return 0

  let score = 0

  if (student.name && student.name.trim() !== '') score += 10
  if (student.description && student.description.trim() !== '') score += 10

  if (student._count.skills > 0) score += 15

  if (student._count.experiences > 0) score += 20

  if (student._count.educations > 0) score += 20

  if (student._count.languages > 0) score += 10

  if (student._count.portfolios > 0) score += 10

  if (student._count.addresses > 0) score += 5

  return Math.min(score, 100)
}

export const updateProfileComplete = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { profileComplete: true, userId: true }
  })

  if (!student) return 0

  const oldProfileComplete = student.profileComplete || 0
  const profileComplete = await calculateProfileComplete(studentId)
  
  await prisma.student.update({
    where: { id: studentId },
    data: { profileComplete }
  })

  const milestones = [25, 50, 75, 100]
  const crossedMilestone = milestones.find(milestone => 
    oldProfileComplete < milestone && profileComplete >= milestone
  )

  if (crossedMilestone) {
    const messages = {
      25: "Great start! Your profile is 25% complete. Keep adding details to stand out!",
      50: "Halfway there! Your profile is 50% complete. You're making great progress!",
      75: "Almost there! Your profile is 75% complete. Just a few more details!",
      100: "Congratulations! Your profile is 100% complete. You're all set to discover amazing opportunities!"
    }

    createNotification({
      userId: student.userId,
      type: 'PROFILE_MILESTONE',
      title: 'Profile milestone reached!',
      message: messages[crossedMilestone]
    }).catch(error => {
      logger.error('profile_milestone_notification_error', { error: error.message })
    })
  }

  return profileComplete
}

