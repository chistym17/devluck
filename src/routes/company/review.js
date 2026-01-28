import express from 'express'
import { getCompanyReviews } from '../../controllers/company/reviewController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.get('/reviews', authMiddleware, getCompanyReviews)

export default router



