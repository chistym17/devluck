import express from 'express'
import { getCompanyReviews } from '../../controllers/company/reviewController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/reviews', authMiddleware, requireCompany, getCompanyReviews)

export default router

