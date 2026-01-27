import express from 'express'
import {
  getSettings,
  updateSettings,
  changePassword
} from '../../controllers/student/settingsController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/settings', authMiddleware, requireStudent, getSettings)
router.put('/settings', authMiddleware, requireStudent, updateSettings)
router.put('/password', authMiddleware, requireStudent, changePassword)

export default router

