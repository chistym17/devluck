import express from 'express'
import {
  createOpportunity,
  updateOpportunity,
  listOpportunities,
  getOpportunityById,
  getRecentOpportunities,
  deleteOpportunity
} from '../../controllers/company/opportunityController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/opportunities', authMiddleware, requireCompany, listOpportunities)
router.get('/opportunities/recent', authMiddleware, requireCompany, getRecentOpportunities)
router.get('/opportunities/:id', authMiddleware, requireCompany, getOpportunityById)
router.post('/opportunities', authMiddleware, requireCompany, createOpportunity)
router.put('/opportunities/:id', authMiddleware, requireCompany, updateOpportunity)
router.delete('/opportunities/:id', authMiddleware, requireCompany, deleteOpportunity)

export default router



