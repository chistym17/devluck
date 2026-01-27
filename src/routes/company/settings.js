import express from 'express'
import {
    getSettings,
    updateSettings,
    changePassword,
    getProfile,
    updateProfile,
    uploadLogo,
    deleteProfile
} from '../../controllers/company/settingsController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { requireCompany } from '../../middleware/roleMiddleware.js'
import { upload } from '../../controllers/uploadController.js'

const router = express.Router()

// Get settings
router.get('/settings', authMiddleware, requireCompany, getSettings)

// Update settings
router.put('/settings', authMiddleware, requireCompany, updateSettings)

// Change password
router.put('/password', authMiddleware, requireCompany, changePassword)

// Get company profile
router.get('/profile', authMiddleware, requireCompany, getProfile)

// Update company profile
router.put('/profile', authMiddleware, requireCompany, updateProfile)

router.post('/profile/logo', authMiddleware, requireCompany, upload.single('image'), uploadLogo)

// Delete company profile
router.delete('/profile', authMiddleware, requireCompany, deleteProfile)

export default router
