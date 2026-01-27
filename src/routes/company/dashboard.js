import express from 'express'
import {
  getDashboardStats,
  getDashboardRecentApplicants
} from '../../controllers/company/dashboardController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/dashboard/stats', authMiddleware, requireCompany, getDashboardStats)
router.get('/dashboard/recent-applicants', authMiddleware, requireCompany, getDashboardRecentApplicants)

export default router


