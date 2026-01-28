import express from 'express'
import {
  listNotifications,
  markAsRead,
  markAllAsRead
} from '../../controllers/student/notificationController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/notifications', authMiddleware, requireStudent, listNotifications)
router.put('/notifications/:id/read', authMiddleware, requireStudent, markAsRead)
router.put('/notifications/read-all', authMiddleware, requireStudent, markAllAsRead)

export default router

