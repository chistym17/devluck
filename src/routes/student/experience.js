import express from 'express'
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from '../../controllers/student/experienceController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/experience', authMiddleware, requireStudent, getExperiences)
router.get('/experience/:id', authMiddleware, requireStudent, getExperience)
router.post('/experience', authMiddleware, requireStudent, createExperience)
router.put('/experience/:id', authMiddleware, requireStudent, updateExperience)
router.delete('/experience/:id', authMiddleware, requireStudent, deleteExperience)

export default router

