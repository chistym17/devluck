import express from 'express'
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../../controllers/company/addressController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/addresses', authMiddleware, requireCompany, getAddresses)
router.post('/addresses', authMiddleware, requireCompany, createAddress)
router.put('/addresses/:id', authMiddleware, requireCompany, updateAddress)
router.delete('/addresses/:id', authMiddleware, requireCompany, deleteAddress)

export default router

