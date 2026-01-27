import express from 'express'
import {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} from '../../controllers/student/portfolioController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/portfolio', authMiddleware, requireStudent, getPortfolios)
router.get('/portfolio/:id', authMiddleware, requireStudent, getPortfolio)
router.post('/portfolio', authMiddleware, requireStudent, createPortfolio)
router.put('/portfolio/:id', authMiddleware, requireStudent, updatePortfolio)
router.delete('/portfolio/:id', authMiddleware, requireStudent, deletePortfolio)

export default router


