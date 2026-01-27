import express from 'express'
import {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage
} from '../../controllers/student/languageController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/languages', authMiddleware, requireStudent, getLanguages)
router.post('/languages', authMiddleware, requireStudent, createLanguage)
router.put('/languages/:id', authMiddleware, requireStudent, updateLanguage)
router.delete('/languages/:id', authMiddleware, requireStudent, deleteLanguage)

export default router


