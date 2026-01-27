import express from 'express'
import {
  listPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentStats
} from '../../controllers/company/paymentController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/payments', authMiddleware, requireCompany, listPayments)
router.get('/payments/stats', authMiddleware, requireCompany, getPaymentStats)
router.post('/payments', authMiddleware, requireCompany, createPayment)
router.put('/payments/:id', authMiddleware, requireCompany, updatePayment)
router.delete('/payments/:id', authMiddleware, requireCompany, deletePayment)

export default router


