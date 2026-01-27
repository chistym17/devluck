import express from 'express'
import {
  listDocuments,
  createDocument
} from '../../controllers/company/documentController.js'

const router = express.Router()

router.get('/documents', listDocuments)
router.post('/documents', createDocument)

export default router


