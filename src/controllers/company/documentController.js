import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'
import cloudinary from '../../config/cloudinary.js'

export const uploadDocument = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      })
    }

    const file = req.file
    const fileType = file.mimetype
    const fileSize = file.size / 1024 / 1024

    let uploadOptions = {
      folder: 'company-documents',
      resource_type: 'auto'
    }

    if (fileType.startsWith('image/')) {
      uploadOptions.transformation = [
        { width: 1000, quality: 'auto' }
      ]
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(file.buffer)
    })

    const document = await prisma.document.create({
      data: {
        fileName: file.originalname,
        fileUrl: result.secure_url,
        fileType: fileType,
        fileSize: fileSize,
        companyId: company.id
      }
    })

    return res.status(200).json({
      status: 'success',
      data: document
    })
  } catch (error) {
    logger.error('upload_document_error', { error: error.message, stack: error.stack })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to upload document'
    })
  }
}

export const getDocuments = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const documents = await prisma.document.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: documents
    })
  } catch (error) {
    logger.error('get_documents_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get documents'
    })
  }
}

export const deleteDocument = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const document = await prisma.document.findUnique({
      where: { id }
    })

    if (!document) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found'
      })
    }

    if (document.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }

    const publicId = document.fileUrl.split('/').slice(-2).join('/').split('.')[0]

    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
    } catch (cloudinaryError) {
      logger.error('cloudinary_delete_error', { error: cloudinaryError.message })
    }

    await prisma.document.delete({
      where: { id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Document deleted successfully'
    })
  } catch (error) {
    logger.error('delete_document_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete document'
    })
  }
}
