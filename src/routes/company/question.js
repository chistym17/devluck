import express from 'express'
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  bulkUpdateQuestions
} from '../../controllers/company/questionController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/opportunities/:opportunityId/questions', authMiddleware, requireCompany, createQuestion)
router.get('/opportunities/:opportunityId/questions', authMiddleware, requireCompany, getQuestions)
router.put('/opportunities/:opportunityId/questions/:questionId', authMiddleware, requireCompany, updateQuestion)
router.delete('/opportunities/:opportunityId/questions/:questionId', authMiddleware, requireCompany, deleteQuestion)
router.put('/opportunities/:opportunityId/questions', authMiddleware, requireCompany, bulkUpdateQuestions)

export default router

