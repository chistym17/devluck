import express from 'express'
import {
  createApplication,
  getApplications,
  getApplication,
  withdrawApplication,
  deleteApplication,
  checkApplicationExists
} from '../../controllers/student/applicationController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/applications', authMiddleware, requireStudent, getApplications)
router.get('/applications/:id', authMiddleware, requireStudent, getApplication)
router.get('/applications/check/:opportunityId', authMiddleware, requireStudent, checkApplicationExists)
router.post('/applications', authMiddleware, requireStudent, createApplication)
router.put('/applications/:id/withdraw', authMiddleware, requireStudent, withdrawApplication)
router.delete('/applications/:id', authMiddleware, requireStudent, deleteApplication)

export default router

