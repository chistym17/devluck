import express from 'express'
import {
  getTopApplicants,
  getTopApplicantById
} from '../../controllers/company/topApplicantController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/top-applicants', authMiddleware, requireCompany, getTopApplicants)
router.get('/top-applicants/:studentId', authMiddleware, requireCompany, getTopApplicantById)

export default router

