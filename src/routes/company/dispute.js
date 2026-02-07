import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../utils/companyUtils.js'
import { 
  listDisputes, 
  getDisputeById, 
  updateDisputeStatus,
  resolveDispute,
  rejectDispute,
  getDisputeStats
} from '../../controllers/company/disputeController.js'

const router = express.Router()

// All routes require authentication and company role
router.get('/disputes', authMiddleware, requireCompany, listDisputes)
router.get('/disputes/stats', authMiddleware, requireCompany, getDisputeStats)
router.get('/disputes/:id', authMiddleware, requireCompany, getDisputeById)
router.put('/disputes/:id/status', authMiddleware, requireCompany, updateDisputeStatus)
router.put('/disputes/:id/resolve', authMiddleware, requireCompany, resolveDispute)
router.put('/disputes/:id/reject', authMiddleware, requireCompany, rejectDispute)

export default router

