import express from 'express'
import {
  listPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  bulkUpdatePrograms,
  addPrograms
} from '../../controllers/company/programController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/programs', authMiddleware, requireCompany, listPrograms)
router.post('/programs', authMiddleware, requireCompany, createProgram)
router.post('/programs/add', authMiddleware, requireCompany, addPrograms)
router.put('/programs/:id', authMiddleware, requireCompany, updateProgram)
router.delete('/programs/:id', authMiddleware, requireCompany, deleteProgram)
router.put('/programs', authMiddleware, requireCompany, bulkUpdatePrograms)

export default router


