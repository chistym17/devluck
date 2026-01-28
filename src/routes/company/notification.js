import express from 'express'
import {
  listNotifications,
  markAsRead,
  markAllAsRead
} from '../../controllers/company/notificationController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/notifications', authMiddleware, requireCompany, listNotifications)
router.put('/notifications/:id/read', authMiddleware, requireCompany, markAsRead)
router.put('/notifications/read-all', authMiddleware, requireCompany, markAllAsRead)

export default router

