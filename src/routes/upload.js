import express from 'express'
import { uploadImage, upload } from '../controllers/uploadController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/image', authMiddleware, upload.single('image'), uploadImage)

export default router


