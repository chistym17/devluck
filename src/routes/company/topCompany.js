import express from 'express'
import {
  getTopCompanies,
  getTopCompanyById
} from '../../controllers/company/topCompanyController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.get('/top-companies', authMiddleware, getTopCompanies)
router.get('/top-companies/:companyId', authMiddleware, getTopCompanyById)

export default router

