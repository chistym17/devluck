import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent } from '../../utils/studentUtils.js'
import { createNotification } from '../../utils/notificationService.js'

export const createReview = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { review, rating, contractId } = req.body

    if (!review || review.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Review text is required'
      })
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      })
    }

    if (!contractId) {
      return res.status(400).json({
        status: 'error',
        message: 'Contract ID is required'
      })
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        company: {
          select: {
            id: true
          }
        }
      }
    })

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Contract not found'
      })
    }

    if (contract.studentId !== student.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This contract does not belong to you.'
      })
    }

    const newReview = await prisma.review.create({
      data: {
        studentId: student.id,
        name: student.name,
        review: review.trim(),
        rating: parseInt(rating),
        contractId: contractId,
        companyId: contract.companyId
      }
    })

    prisma.company
      .findUnique({
        where: { id: contract.companyId },
        select: {
          id: true,
          userId: true
        }
      })
      .then((company) => {
        if (!company || !company.userId) return
        return createNotification({
          userId: company.userId,
          type: 'REVIEW_RECEIVED',
          title: 'New review received',
          message: `${student.name} left a ${parseInt(rating)}-star review for contract "${contract.contractTitle || 'your contract'}"`
        })
      })
      .catch((notificationError) => {
        logger.error('create_review_notification_error', {
          error: notificationError.message
        })
      })

    return res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully',
      data: newReview
    })
  } catch (error) {
    logger.error('create_review_error', { error: error.message, stack: error.stack })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create review'
    })
  }
}

export const getReviewsByContract = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { contractId } = req.params

    if (!contractId) {
      return res.status(400).json({
        status: 'error',
        message: 'Contract ID is required'
      })
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    })

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Contract not found'
      })
    }

    if (contract.studentId !== student.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This contract does not belong to you.'
      })
    }

    const reviews = await prisma.review.findMany({
      where: {
        contractId: contractId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      status: 'success',
      data: reviews
    })
  } catch (error) {
    logger.error('get_reviews_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get reviews'
    })
  }
}

export const getReviewsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params

    if (!companyId) {
      return res.status(400).json({
        status: 'error',
        message: 'Company ID is required'
      })
    }

    const reviews = await prisma.review.findMany({
      where: {
        companyId: companyId
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      reviewerName: review.name,
      reviewerImage: review.student?.image || '/images/default-avatar.png',
      dateReviewed: new Date(review.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      rating: review.rating,
      reviewText: review.review,
      createdAt: review.createdAt
    }))

    return res.status(200).json({
      status: 'success',
      data: formattedReviews
    })
  } catch (error) {
    logger.error('get_company_reviews_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get reviews'
    })
  }
}

