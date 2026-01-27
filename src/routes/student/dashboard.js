import express from 'express'
import { getDashboardStats } from '../../controllers/student/dashboardController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/dashboard/stats', authMiddleware, requireStudent, getDashboardStats)

export default router

