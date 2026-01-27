import express from 'express'
import { listPayments } from '../../controllers/student/paymentController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/payments', authMiddleware, requireStudent, listPayments)

export default router

