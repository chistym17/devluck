import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'
import {
  createDispute,
  listDisputes,
  getDisputeById
} from '../../controllers/student/disputeController.js'

const router = express.Router()

// All routes require authentication and student role
router.post('/contracts/:contractId/dispute', authMiddleware, requireStudent, createDispute)
router.get('/disputes', authMiddleware, requireStudent, listDisputes)
router.get('/disputes/:id', authMiddleware, requireStudent, getDisputeById)

export default router

