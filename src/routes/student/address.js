import express from 'express'
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../../controllers/student/addressController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireStudent } from '../../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/addresses', authMiddleware, requireStudent, getAddresses)
router.post('/addresses', authMiddleware, requireStudent, createAddress)
router.put('/addresses/:id', authMiddleware, requireStudent, updateAddress)
router.delete('/addresses/:id', authMiddleware, requireStudent, deleteAddress)

export default router

