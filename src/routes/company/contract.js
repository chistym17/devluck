import express from 'express'
import {
  listContracts,
  createContract,
  getContractById,
  updateContract,
  deleteContract,
  getContractStats,
  getEmployees
} from '../../controllers/company/contractController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/contracts', authMiddleware, requireCompany, listContracts)
router.get('/contracts/stats', authMiddleware, requireCompany, getContractStats)
router.get('/contracts/employees', authMiddleware, requireCompany, getEmployees)
router.get('/employees', authMiddleware, requireCompany, getEmployees)
router.get('/contracts/:id', authMiddleware, requireCompany, getContractById)
router.post('/contracts', authMiddleware, requireCompany, createContract)
router.put('/contracts/:id', authMiddleware, requireCompany, updateContract)
router.delete('/contracts/:id', authMiddleware, requireCompany, deleteContract)

export default router


