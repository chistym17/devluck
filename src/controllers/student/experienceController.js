import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, checkResourceOwnership, updateProfileComplete } from '../../utils/studentUtils.js'

export const getExperiences = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const experiences = await prisma.experience.findMany({
      where: { studentId: student.id },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      status: 'success',
      data: experiences
    })
  } catch (error) {
    logger.error('get_experiences_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get experiences'
    })
  }
}

export const getExperience = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const experience = await prisma.experience.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(experience, student.id, 'Experience')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({
      status: 'success',
      data: experience
    })
  } catch (error) {
    logger.error('get_experience_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get experience'
    })
  }
}

export const createExperience = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { role, companyName, startDate, endDate, description } = req.body

    if (!role || role.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'role is required'
      })
    }

    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'companyName is required'
      })
    }

    const experience = await prisma.experience.create({
      data: {
        studentId: student.id,
        role: role.trim(),
        companyName: companyName.trim(),
        startDate: startDate?.trim() || null,
        endDate: endDate?.trim() || null,
        description: description?.trim() || null
      }
    })

    await updateProfileComplete(student.id)

    return res.status(201).json({
      status: 'success',
      message: 'Experience created successfully',
      data: experience
    })
  } catch (error) {
    logger.error('create_experience_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create experience'
    })
  }
}

export const updateExperience = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params
    const { role, companyName, startDate, endDate, description } = req.body

    const existingExperience = await prisma.experience.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingExperience, student.id, 'Experience')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const updateData = {}
    if (role !== undefined) updateData.role = role.trim()
    if (companyName !== undefined) updateData.companyName = companyName.trim()
    if (startDate !== undefined) updateData.startDate = startDate?.trim() || null
    if (endDate !== undefined) updateData.endDate = endDate?.trim() || null
    if (description !== undefined) updateData.description = description?.trim() || null

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: updateData
    })

    return res.status(200).json({
      status: 'success',
      message: 'Experience updated successfully',
      data: updatedExperience
    })
  } catch (error) {
    logger.error('update_experience_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update experience'
    })
  }
}

export const deleteExperience = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const existingExperience = await prisma.experience.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingExperience, student.id, 'Experience')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.experience.delete({
      where: { id }
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Experience deleted successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      })
    }

    logger.error('delete_experience_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete experience'
    })
  }
}


