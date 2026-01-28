import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'

export const getCompanyReviews = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    const targetCompanyId = req.query.companyId

    let companyId
    if (targetCompanyId) {
      companyId = targetCompanyId
    } else if (req.user.role === 'COMPANY') {
      const company = await prisma.company.findUnique({
        where: { userId: req.user.id }
      })
      if (!company) {
        return res.status(404).json({
          status: 'error',
          message: 'Company not found'
        })
      }
      companyId = company.id
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Company ID is required for non-company users'
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
        },
        contract: {
          select: {
            id: true,
            contractTitle: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      studentId: review.studentId,
      name: review.name,
      review: review.review,
      rating: review.rating,
      contractId: review.contractId,
      contractTitle: review.contract?.contractTitle || null,
      studentImage: review.student?.image || null,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
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



