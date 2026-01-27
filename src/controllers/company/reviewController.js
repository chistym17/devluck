import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'

export const getCompanyReviews = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const reviews = await prisma.review.findMany({
      where: {
        companyId: company.id
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

