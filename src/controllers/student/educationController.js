import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, checkResourceOwnership, updateProfileComplete } from '../../utils/studentUtils.js'

export const getEducations = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const educations = await prisma.education.findMany({
      where: { studentId: student.id },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      status: 'success',
      data: educations
    })
  } catch (error) {
    logger.error('get_educations_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get educations'
    })
  }
}

export const getEducation = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const education = await prisma.education.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(education, student.id, 'Education')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({
      status: 'success',
      data: education
    })
  } catch (error) {
    logger.error('get_education_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get education'
    })
  }
}

export const createEducation = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { name, major, startDate, endDate, description } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'name (institution name) is required'
      })
    }

    if (!major || major.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'major is required'
      })
    }

    const education = await prisma.education.create({
      data: {
        studentId: student.id,
        name: name.trim(),
        major: major.trim(),
        startDate: startDate?.trim() || null,
        endDate: endDate?.trim() || null,
        description: description?.trim() || null
      }
    })

    return res.status(201).json({
      status: 'success',
      message: 'Education created successfully',
      data: education
    })
  } catch (error) {
    logger.error('create_education_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create education'
    })
  }
}

export const updateEducation = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params
    const { name, major, startDate, endDate, description } = req.body

    const existingEducation = await prisma.education.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingEducation, student.id, 'Education')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (major !== undefined) updateData.major = major.trim()
    if (startDate !== undefined) updateData.startDate = startDate?.trim() || null
    if (endDate !== undefined) updateData.endDate = endDate?.trim() || null
    if (description !== undefined) updateData.description = description?.trim() || null

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedEducation = await prisma.education.update({
      where: { id },
      data: updateData
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Education updated successfully',
      data: updatedEducation
    })
  } catch (error) {
    logger.error('update_education_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update education'
    })
  }
}

export const deleteEducation = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const existingEducation = await prisma.education.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingEducation, student.id, 'Education')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.education.delete({
      where: { id }
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Education deleted successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Education not found'
      })
    }

    logger.error('delete_education_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete education'
    })
  }
}


