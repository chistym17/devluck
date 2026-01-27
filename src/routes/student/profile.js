import express from 'express'
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from '../../controllers/student/profileController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/profile', authMiddleware, requireStudent, createProfile)
router.get('/profile', authMiddleware, requireStudent, getProfile)
router.put('/profile', authMiddleware, requireStudent, updateProfile)
router.delete('/profile', authMiddleware, requireStudent, deleteProfile)

export default router

