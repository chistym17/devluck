import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, checkResourceOwnership, updateProfileComplete } from '../../utils/studentUtils.js'

export const getPortfolios = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const portfolios = await prisma.portfolio.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: portfolios
    })
  } catch (error) {
    logger.error('get_portfolios_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get portfolios'
    })
  }
}

export const getPortfolio = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(portfolio, student.id, 'Portfolio')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({
      status: 'success',
      data: portfolio
    })
  } catch (error) {
    logger.error('get_portfolio_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get portfolio item'
    })
  }
}

export const createPortfolio = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { name, link } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'name is required'
      })
    }

    if (!link || link.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'link is required'
      })
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        studentId: student.id,
        name: name.trim(),
        link: link.trim()
      }
    })

    await updateProfileComplete(student.id)

    return res.status(201).json({
      status: 'success',
      message: 'Portfolio item created successfully',
      data: portfolio
    })
  } catch (error) {
    logger.error('create_portfolio_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create portfolio item'
    })
  }
}

export const updatePortfolio = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params
    const { name, link } = req.body

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingPortfolio, student.id, 'Portfolio')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (link !== undefined) updateData.link = link.trim()

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: updateData
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Portfolio item updated successfully',
      data: updatedPortfolio
    })
  } catch (error) {
    logger.error('update_portfolio_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update portfolio item'
    })
  }
}

export const deletePortfolio = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingPortfolio, student.id, 'Portfolio')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.portfolio.delete({
      where: { id }
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Portfolio item deleted successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Portfolio item not found'
      })
    }

    logger.error('delete_portfolio_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete portfolio item'
    })
  }
}


