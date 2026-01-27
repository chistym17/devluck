import express from 'express'
import { createReview, getReviewsByContract, getReviewsByCompanyId } from '../../controllers/student/reviewController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/reviews', authMiddleware, requireStudent, createReview)
router.get('/contracts/:contractId/reviews', authMiddleware, requireStudent, getReviewsByContract)
router.get('/companies/:companyId/reviews', getReviewsByCompanyId)

export default router

