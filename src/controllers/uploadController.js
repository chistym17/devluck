import cloudinary from '../config/cloudinary.js'
import logger from '../utils/logger.js'
import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    }
})

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No file uploaded'
            })
        }

        const uploadOptions = {
            folder: 'student-profiles',
            resource_type: 'image',
            transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' }
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
            uploadStream.end(req.file.buffer)
        })

        return res.status(200).json({
            status: 'success',
            data: {
                url: result.secure_url,
                publicId: result.public_id
            }
        })
    } catch (error) {
        logger.error('upload_image_error', { error: error.message, stack: error.stack })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to upload image',
            error: error.message
        })
    }
}

export { upload }


