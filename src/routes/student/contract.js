import express from 'express'
import {
  listContracts,
  getContractById
} from '../../controllers/student/contractController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/contracts', authMiddleware, requireStudent, listContracts)
router.get('/contracts/:id', authMiddleware, requireStudent, getContractById)

export default router

