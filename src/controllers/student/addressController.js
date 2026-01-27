import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, checkResourceOwnership, updateProfileComplete } from '../../utils/studentUtils.js'

export const getAddresses = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const addresses = await prisma.address.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: addresses
    })
  } catch (error) {
    logger.error('get_addresses_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to get addresses' })
  }
}

export const createAddress = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { name, tag, address, phoneNumber } = req.body

    if (!name || !tag || !address || !phoneNumber) {
      return res.status(400).json({ status: 'error', message: 'name, tag, address, and phoneNumber are required' })
    }

    const newAddress = await prisma.address.create({
      data: {
        studentId: student.id,
        name,
        tag,
        address,
        phoneNumber
      }
    })

    return res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: newAddress
    })
  } catch (error) {
    logger.error('create_address_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to create address' })
  }
}

export const updateAddress = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params
    const { name, tag, address, phoneNumber } = req.body

    const existingAddress = await prisma.address.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingAddress, student.id, 'Address')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
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

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: updatedAddress
    })
  } catch (error) {
    logger.error('update_address_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to update address' })
  }
}

export const deleteAddress = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { id } = req.params

    const existingAddress = await prisma.address.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingAddress, student.id, 'Address')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.address.delete({
      where: { id }
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    })
  } catch (error) {
    logger.error('delete_address_error', { error: error.message })
    return res.status(500).json({ status: 'error', message: 'Failed to delete address' })
  }
}

