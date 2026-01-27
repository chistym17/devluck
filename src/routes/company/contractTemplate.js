import express from 'express'
import {
  listContractTemplates,
  createContractTemplate,
  getContractTemplateById,
  updateContractTemplate,
  deleteContractTemplate,
  getContractTemplateStats
} from '../../controllers/company/contractTemplateController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/contract-templates/stats', authMiddleware, requireCompany, getContractTemplateStats)
router.get('/contract-templates', authMiddleware, requireCompany, listContractTemplates)
router.post('/contract-templates', authMiddleware, requireCompany, createContractTemplate)
router.get('/contract-templates/:id', authMiddleware, requireCompany, getContractTemplateById)
router.put('/contract-templates/:id', authMiddleware, requireCompany, updateContractTemplate)
router.delete('/contract-templates/:id', authMiddleware, requireCompany, deleteContractTemplate)

export default router


