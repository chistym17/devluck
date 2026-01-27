import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, checkResourceOwnership, updateProfileComplete } from '../../utils/studentUtils.js'

export const getLanguages = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const languages = await prisma.language.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: languages
    })
  } catch (error) {
    logger.error('get_languages_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get languages'
    })
  }
}

export const createLanguage = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { name, level } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'name is required'
      })
    }

    if (!level || level.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'level is required'
      })
    }

    const language = await prisma.language.create({
      data: {
        studentId: student.id,
        name: name.trim(),
        level: level.trim()
      }
    })

    return res.status(201).json({
      status: 'success',
      message: 'Language created successfully',
      data: language
    })
  } catch (error) {
    logger.error('create_language_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create language'
    })
  }
}

export const updateLanguage = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params
    const { name, level } = req.body

    const existingLanguage = await prisma.language.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingLanguage, student.id, 'Language')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (level !== undefined) updateData.level = level.trim()

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedLanguage = await prisma.language.update({
      where: { id },
      data: updateData
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Language updated successfully',
      data: updatedLanguage
    })
  } catch (error) {
    logger.error('update_language_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update language'
    })
  }
}

export const deleteLanguage = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const existingLanguage = await prisma.language.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingLanguage, student.id, 'Language')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.language.delete({
      where: { id }
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Language deleted successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Language not found'
      })
    }

    logger.error('delete_language_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete language'
    })
  }
}


