import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'
import { recalculateCompanyProgress } from '../../utils/companyProfileProgress.js'

export const getAddresses = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const addresses = await prisma.address.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: addresses
    })
  } catch (error) {
    logger.error('get_company_addresses_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get addresses' })
  }
}

export const createAddress = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { name, tag, address, phoneNumber } = req.body

    if (!name || !tag || !address || !phoneNumber) {
      return res.status(400).json({ status: 'error', message: 'name, tag, address, and phoneNumber are required' })
    }

    const newAddress = await prisma.address.create({
      data: {
        companyId: company.id,
        name,
        tag,
        address,
        phoneNumber
      }
    })

    await recalculateCompanyProgress(company.id)

    return res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: newAddress
    })
  } catch (error) {
    logger.error('create_company_address_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to create address' })
  }
}

export const updateAddress = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const { name, tag, address, phoneNumber } = req.body

    const existingAddress = await prisma.address.findUnique({
      where: { id }
    })

    if (!existingAddress) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      })
    }

    if (existingAddress.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This address does not belong to you.'
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (tag !== undefined) updateData.tag = tag
    if (address !== undefined) updateData.address = address
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: 'No fields to update' })
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: updateData
    })

    return res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: updatedAddress
    })
  } catch (error) {
    logger.error('update_company_address_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to update address' })
  }
}

export const deleteAddress = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const existingAddress = await prisma.address.findUnique({
      where: { id }
    })

    if (!existingAddress) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      })
    }

    if (existingAddress.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This address does not belong to you.'
      })
    }

    await prisma.address.delete({
      where: { id }
    })

    await recalculateCompanyProgress(company.id)

    return res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    })
  } catch (error) {
    logger.error('delete_company_address_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to delete address' })
  }
}

