import express from 'express'
import {
  listAllOpportunities,
  getOpportunityById,
  getOpportunityQuestions
} from '../../controllers/student/opportunityController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/opportunities', authMiddleware, requireStudent, listAllOpportunities)
router.get('/opportunities/:id', authMiddleware, requireStudent, getOpportunityById)
router.get('/opportunities/:opportunityId/questions', authMiddleware, requireStudent, getOpportunityQuestions)

export default router

