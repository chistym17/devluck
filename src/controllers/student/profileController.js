import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, getStudentFromUser, updateProfileComplete } from '../../utils/studentUtils.js'

export const createProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    const existingStudent = await getStudentFromUser(req.user.id)

    if (existingStudent) {
      return res.status(409).json({
        status: 'error',
        message: 'Student profile already exists. Use PUT to update.'
      })
    }

    const { name, email, description, status, availability, salaryExpectation, profileRanking, profileComplete, image } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Name is required'
      })
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      })
    }

    if (availability && !['Hybrid', 'Remote', 'Onsite'].includes(availability)) {
      return res.status(400).json({
        status: 'error',
        message: 'Availability must be one of: Hybrid, Remote, Onsite'
      })
    }

    if (profileComplete !== undefined) {
      if (profileComplete < 0 || profileComplete > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'profileComplete must be between 0 and 100'
        })
      }
    }

    const profileCompleteValue = profileComplete !== undefined ? profileComplete : 0

    const newStudent = await prisma.student.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        description: description?.trim() || null,
        image: image || null,
        status: status || 'active',
        availability: availability || null,
        salaryExpectation: salaryExpectation !== undefined && salaryExpectation !== null ? parseFloat(salaryExpectation) : null,
        profileRanking: profileRanking || null,
        profileComplete: profileCompleteValue
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    })

    return res.status(201).json({
      status: 'success',
      message: 'Student profile created successfully',
      data: newStudent
    })
  } catch (error) {
    logger.error('create_profile_error', { error: error.message })

    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'Student profile already exists for this user'
      })
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to create student profile'
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const studentProfile = await prisma.student.findUnique({
      where: { id: student.id }
    })

    return res.status(200).json({
      status: 'success',
      data: studentProfile
    })
  } catch (error) {
    logger.error('get_profile_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get student profile'
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { name, email, description, status, availability, salaryExpectation, profileRanking, profileComplete, image } = req.body

    if (email !== undefined && email !== null) {
      if (!email.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Email cannot be empty'
        })
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid email format'
        })
      }
    }

    if (availability !== undefined && availability !== null && !['Hybrid', 'Remote', 'Onsite'].includes(availability)) {
      return res.status(400).json({
        status: 'error',
        message: 'Availability must be one of: Hybrid, Remote, Onsite'
      })
    }

    if (profileComplete !== undefined) {
      if (profileComplete < 0 || profileComplete > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'profileComplete must be between 0 and 100'
        })
      }
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.trim().toLowerCase()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (image !== undefined) updateData.image = image || null
    if (status !== undefined) updateData.status = status
    if (availability !== undefined) updateData.availability = availability || null
    if (salaryExpectation !== undefined) updateData.salaryExpectation = salaryExpectation !== null ? parseFloat(salaryExpectation) : null
    if (profileRanking !== undefined) updateData.profileRanking = profileRanking
    if (profileComplete !== undefined) updateData.profileComplete = profileComplete

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: updateData
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedStudent
    })
  } catch (error) {
    logger.error('update_profile_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update student profile'
    })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    await prisma.user.delete({
      where: { id: student.userId }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully'
    })
  } catch (error) {
    logger.error('delete_profile_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete account'
    })
  }
}

