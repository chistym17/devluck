import bcrypt from 'bcryptjs'
import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'
import cloudinary from '../../config/cloudinary.js'
import { recalculateCompanyProgress } from '../../utils/companyProfileProgress.js'
import { createNotification } from '../../utils/notificationService.js'

export const getSettings = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        let settings = await prisma.companySettings.findUnique({
            where: { companyId: company.id }
        })

        if (!settings) {
            settings = await prisma.companySettings.create({
                data: {
                    companyId: company.id,
                    theme: 'light',
                    themeColor: '#FFEB9C'
                }
            })
        }

        return res.status(200).json({
            status: 'success',
            data: {
                theme: settings.theme,
                themeColor: settings.themeColor
            }
        })
    } catch (error) {
        logger.error('get_company_settings_error', { error: error.message })
        return res.status(500).json({ status: 'error', message: 'Failed to get settings' })
    }
}

export const updateSettings = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const { theme, themeColor } = req.body

        const updateData = {}
        if (theme !== undefined) updateData.theme = theme
        if (themeColor !== undefined) updateData.themeColor = themeColor

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ status: 'error', message: 'No fields to update' })
        }

        const settings = await prisma.companySettings.upsert({
            where: { companyId: company.id },
            update: updateData,
            create: {
                companyId: company.id,
                theme: theme || 'light',
                themeColor: themeColor || '#FFEB9C'
            }
        })

        return res.status(200).json({
            status: 'success',
            message: 'Settings updated successfully',
            data: {
                theme: settings.theme,
                themeColor: settings.themeColor
            }
        })
    } catch (error) {
        logger.error('update_company_settings_error', { error: error.message })
        return res.status(500).json({ status: 'error', message: 'Failed to update settings' })
    }
}

export const changePassword = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const { currentPassword, newPassword, confirmPassword } = req.body

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ status: 'error', message: 'currentPassword, newPassword, and confirmPassword are required' })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ status: 'error', message: 'New password and confirm password do not match' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ status: 'error', message: 'New password must be at least 6 characters long' })
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        })

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Current password is incorrect' })
        }

        const passwordHash = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash }
        })

        createNotification({
            userId: req.user.id,
            type: 'PASSWORD_CHANGED',
            title: 'Password changed',
            message: 'Your password was changed successfully. If this wasn\'t you, please secure your account immediately.'
        }).catch(error => {
            logger.error('password_change_notification_error', { error: error.message })
        })

        return res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        })
    } catch (error) {
        logger.error('change_company_password_error', { error: error.message })
        return res.status(500).json({ status: 'error', message: 'Failed to change password' })
    }
}

export const getProfile = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const companyWithUser = await prisma.company.findUnique({
            where: { id: company.id },
            include: {
                user: {
                    select: {
                        email: true,
                        createdAt: true
                    }
                },
                programs: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                addresses: {
                    select: {
                        id: true,
                        name: true,
                        tag: true,
                        address: true,
                        phoneNumber: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        const progress = await recalculateCompanyProgress(company.id)

        return res.status(200).json({
            status: 'success',
            data: {
                id: companyWithUser.id,
                name: companyWithUser.name,
                industry: companyWithUser.industry,
                website: companyWithUser.website,
                description: companyWithUser.description,
                corporate: companyWithUser.description,
                logo: companyWithUser.logo,
                logoUrl: companyWithUser.logo,
                status: companyWithUser.status,
                progress: progress ?? companyWithUser.progress,
                size: companyWithUser.size,
                foundedYear: companyWithUser.foundedYear,
                location: companyWithUser.location,
                email: companyWithUser.user.email,
                createdAt: companyWithUser.user.createdAt,
                programs: companyWithUser.programs,
                addresses: companyWithUser.addresses
            }
        })
    } catch (error) {
        logger.error('get_company_profile_error', { error: error.message })
        return res.status(500).json({ status: 'error', message: 'Failed to get profile' })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const {
            name,
            industry,
            website,
            description,
            corporate,
            logo,
            logoUrl,
            address,
            phoneNumber,
            size,
            foundedYear,
            location
        } = req.body

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (industry !== undefined) updateData.industry = industry
        if (website !== undefined) updateData.website = website
        if (description !== undefined) updateData.description = description
        if (corporate !== undefined) updateData.description = corporate
        if (logo !== undefined) updateData.logo = logo
        if (logoUrl !== undefined) updateData.logo = logoUrl
        if (address !== undefined) updateData.address = address
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber
        if (size !== undefined) updateData.size = size
        if (foundedYear !== undefined) updateData.foundedYear = foundedYear
        if (location !== undefined) updateData.location = location

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ status: 'error', message: 'No fields to update' })
        }

        const updatedCompany = await prisma.company.update({
            where: { id: company.id },
            data: updateData
        })

        const progress = await recalculateCompanyProgress(company.id)

        return res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                id: updatedCompany.id,
                name: updatedCompany.name,
                industry: updatedCompany.industry,
                website: updatedCompany.website,
                description: updatedCompany.description,
                corporate: updatedCompany.description,
                logo: updatedCompany.logo,
                logoUrl: updatedCompany.logo,
                address: updatedCompany.address,
                phoneNumber: updatedCompany.phoneNumber,
                status: updatedCompany.status,
                progress: progress ?? updatedCompany.progress,
                size: updatedCompany.size,
                foundedYear: updatedCompany.foundedYear,
                location: updatedCompany.location
            }
        })
    } catch (error) {
        logger.error('update_company_profile_error', { error: error.message })
        return res.status(500).json({ status: 'error', message: 'Failed to update profile' })
    }
}

export const uploadLogo = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No file uploaded'
            })
        }

        const uploadOptions = {
            folder: 'company-logos',
            resource_type: 'image',
            transformation: [
                { width: 500, height: 500, crop: 'fill' }
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

        const updatedCompany = await prisma.company.update({
            where: { id: company.id },
            data: { logo: result.secure_url }
        })

        const progress = await recalculateCompanyProgress(company.id)

        return res.status(200).json({
            status: 'success',
            data: {
                logoUrl: updatedCompany.logo,
                logo: updatedCompany.logo,
                progress: progress ?? updatedCompany.progress
            }
        })
    } catch (error) {
        logger.error('upload_company_logo_error', { error: error.message, stack: error.stack })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to upload logo'
        })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        await prisma.user.delete({
            where: { id: company.userId }
        })

        return res.status(200).json({
            status: 'success',
            message: 'Account deleted successfully'
        })
    } catch (error) {
        logger.error('delete_company_profile_error', { error: error.message })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to delete account'
        })
    }
}
