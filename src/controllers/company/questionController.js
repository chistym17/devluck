import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany, checkResourceOwnership } from '../../utils/companyUtils.js'

export const createQuestion = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { opportunityId } = req.params
    const { question, type, options, order, isRequired } = req.body

    if (!question || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'question and type are required'
      })
    }

    if (!['text', 'select', 'checkbox', 'rating'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'type must be one of: text, select, checkbox, rating'
      })
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    })

    if (!opportunity) {
      return res.status(404).json({
        status: 'error',
        message: 'Opportunity not found'
      })
    }

    const ownershipCheck = checkResourceOwnership(opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const questionData = {
      opportunityId,
      question: question.trim(),
      type,
      options: Array.isArray(options) ? options : (options ? [options] : []),
      order: order !== undefined ? parseInt(order, 10) : 0,
      isRequired: isRequired !== undefined ? Boolean(isRequired) : false
    }

    const newQuestion = await prisma.question.create({
      data: questionData
    })

    return res.status(201).json({
      status: 'success',
      message: 'Question created successfully',
      data: newQuestion
    })
  } catch (error) {
    logger.error('create_question_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create question'
    })
  }
}

export const getQuestions = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { opportunityId } = req.params

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    })

    if (!opportunity) {
      return res.status(404).json({
        status: 'error',
        message: 'Opportunity not found'
      })
    }

    const ownershipCheck = checkResourceOwnership(opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const questions = await prisma.question.findMany({
      where: { opportunityId },
      orderBy: { order: 'asc' }
    })

    return res.status(200).json({
      status: 'success',
      data: questions
    })
  } catch (error) {
    logger.error('get_questions_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get questions'
    })
  }
}

export const updateQuestion = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { opportunityId, questionId } = req.params
    const { question, type, options, order, isRequired } = req.body

    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        opportunity: true
      }
    })

    if (!existingQuestion) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      })
    }

    if (existingQuestion.opportunityId !== opportunityId) {
      return res.status(400).json({
        status: 'error',
        message: 'Question does not belong to this opportunity'
      })
    }

    const ownershipCheck = checkResourceOwnership(existingQuestion.opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    if (type && !['text', 'select', 'checkbox', 'rating'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'type must be one of: text, select, checkbox, rating'
      })
    }

    const updateData = {}
    if (question !== undefined) updateData.question = question.trim()
    if (type !== undefined) updateData.type = type
    if (options !== undefined) {
      updateData.options = Array.isArray(options) ? options : (options ? [options] : [])
    }
    if (order !== undefined) updateData.order = parseInt(order, 10)
    if (isRequired !== undefined) updateData.isRequired = Boolean(isRequired)

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: updateData
    })

    return res.status(200).json({
      status: 'success',
      message: 'Question updated successfully',
      data: updatedQuestion
    })
  } catch (error) {
    logger.error('update_question_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update question'
    })
  }
}

export const deleteQuestion = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { opportunityId, questionId } = req.params

    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        opportunity: true
      }
    })

    if (!existingQuestion) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      })
    }

    if (existingQuestion.opportunityId !== opportunityId) {
      return res.status(400).json({
        status: 'error',
        message: 'Question does not belong to this opportunity'
      })
    }

    const ownershipCheck = checkResourceOwnership(existingQuestion.opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.question.delete({
      where: { id: questionId }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Question deleted successfully'
    })
  } catch (error) {
    logger.error('delete_question_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete question'
    })
  }
}

export const bulkUpdateQuestions = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { opportunityId } = req.params
    const { questions } = req.body

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        status: 'error',
        message: 'questions must be an array'
      })
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    })

    if (!opportunity) {
      return res.status(404).json({
        status: 'error',
        message: 'Opportunity not found'
      })
    }

    const ownershipCheck = checkResourceOwnership(opportunity, company.id, 'Opportunity')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.$transaction(
      questions.map((q, index) => {
        if (q.id) {
          return prisma.question.update({
            where: { id: q.id },
            data: {
              question: q.question.trim(),
              type: q.type,
              options: Array.isArray(q.options) ? q.options : [],
              order: index,
              isRequired: q.isRequired !== undefined ? Boolean(q.isRequired) : false
            }
          })
        } else {
          return prisma.question.create({
            data: {
              opportunityId,
              question: q.question.trim(),
              type: q.type,
              options: Array.isArray(q.options) ? q.options : [],
              order: index,
              isRequired: q.isRequired !== undefined ? Boolean(q.isRequired) : false
            }
          })
        }
      })
    )

    const updatedQuestions = await prisma.question.findMany({
      where: { opportunityId },
      orderBy: { order: 'asc' }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Questions updated successfully',
      data: updatedQuestions
    })
  } catch (error) {
    logger.error('bulk_update_questions_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update questions'
    })
  }
}

