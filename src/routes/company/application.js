import express from 'express'
import {
  getApplicationsForOpportunity,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getStudentProfileByStudentId,
  searchUserByEmail
} from '../../controllers/company/applicationController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/applications', authMiddleware, requireCompany, getAllApplications)
router.get('/applications/:id', authMiddleware, requireCompany, getApplicationById)
router.get('/opportunities/:opportunityId/applications', authMiddleware, requireCompany, getApplicationsForOpportunity)
router.get('/students/:studentId', authMiddleware, requireCompany, getStudentProfileByStudentId)
router.get('/students/search/by-email', authMiddleware, requireCompany, searchUserByEmail)
router.put('/applications/:id/status', authMiddleware, requireCompany, updateApplicationStatus)
router.delete('/applications/:id', authMiddleware, requireCompany, deleteApplication)

export default router

