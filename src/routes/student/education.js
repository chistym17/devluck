import express from 'express'
import {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
} from '../../controllers/student/educationController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/education', authMiddleware, requireStudent, getEducations)
router.get('/education/:id', authMiddleware, requireStudent, getEducation)
router.post('/education', authMiddleware, requireStudent, createEducation)
router.put('/education/:id', authMiddleware, requireStudent, updateEducation)
router.delete('/education/:id', authMiddleware, requireStudent, deleteEducation)

export default router


