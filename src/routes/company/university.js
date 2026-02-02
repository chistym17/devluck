import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import {
  createUniversity,
  getUniversities,
  getUniversityById,
  updateUniversity,
  deleteUniversity,
  getUniversityStats
} from '../../controllers/company/universityController.js'

const router = express.Router()

router.post('/universities', authMiddleware, createUniversity)
router.get('/universities', getUniversities)
router.get('/universities/stats', getUniversityStats)
router.get('/universities/:id', getUniversityById)
router.put('/universities/:id', authMiddleware, updateUniversity)
router.delete('/universities/:id', authMiddleware, deleteUniversity)

export default router

