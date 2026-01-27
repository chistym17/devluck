import express from 'express'
import {
  getSkills,
  addSkills,
  removeSkill
} from '../../controllers/student/skillController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/skills', authMiddleware, requireStudent, getSkills)
router.post('/skills', authMiddleware, requireStudent, addSkills)
router.delete('/skills/:skillId', authMiddleware, requireStudent, removeSkill)

export default router

