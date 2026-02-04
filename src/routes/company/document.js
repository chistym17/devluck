import express from 'express'
import {
    uploadDocument,
    getDocuments,
    deleteDocument
} from '../../controllers/company/documentController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'
import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('Only image and PDF files are allowed'), false)
        }
    }
})

const router = express.Router()

router.post('/documents', authMiddleware, requireCompany, upload.single('file'), uploadDocument)

router.get('/documents', authMiddleware, requireCompany, getDocuments)

router.delete('/documents/:id', authMiddleware, requireCompany, deleteDocument)

export default router
