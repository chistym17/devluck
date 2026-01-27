import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'
import { recalculateCompanyProgress } from '../../utils/companyProfileProgress.js'

export const listPrograms = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const programs = await prisma.program.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({
      status: 'success',
      data: programs
    })
  } catch (error) {
    logger.error('list_programs_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list programs'
    })
  }
}

export const createProgram = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { name, description } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Program name is required'
      })
    }

    const program = await prisma.program.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        companyId: company.id
      }
    })

    await recalculateCompanyProgress(company.id)

    return res.status(201).json({
      status: 'success',
      message: 'Program created successfully',
      data: program
    })
  } catch (error) {
    logger.error('create_program_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create program'
    })
  }
}

export const updateProgram = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const { name, description } = req.body

    const program = await prisma.program.findUnique({
      where: { id }
    })

    if (!program) {
      return res.status(404).json({
        status: 'error',
        message: 'Program not found'
      })
    }

    if (program.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      })
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: updateData
    })

    return res.status(200).json({
      status: 'success',
      message: 'Program updated successfully',
      data: updatedProgram
    })
  } catch (error) {
    logger.error('update_program_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update program'
    })
  }
}

export const deleteProgram = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const program = await prisma.program.findUnique({
      where: { id }
    })

    if (!program) {
      return res.status(404).json({
        status: 'error',
        message: 'Program not found'
      })
    }

    if (program.companyId !== company.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      })
    }

    await prisma.program.delete({
      where: { id }
    })

    await recalculateCompanyProgress(company.id)

    return res.status(200).json({
      status: 'success',
      message: 'Program deleted successfully'
    })
  } catch (error) {
    logger.error('delete_program_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete program'
    })
  }
}

export const bulkUpdatePrograms = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { programs } = req.body

    if (!Array.isArray(programs)) {
      return res.status(400).json({
        status: 'error',
        message: 'Programs must be an array'
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.program.deleteMany({
        where: { companyId: company.id }
      })

      if (programs.length > 0) {
        await tx.program.createMany({
          data: programs.map((name) => ({
            name: name.trim(),
            companyId: company.id
          }))
        })
      }
    })

    const updatedPrograms = await prisma.program.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    })

    await recalculateCompanyProgress(company.id)

    return res.status(200).json({
      status: 'success',
      message: 'Programs updated successfully',
      data: updatedPrograms
    })
  } catch (error) {
    logger.error('bulk_update_programs_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update programs'
    })
  }
}

export const addPrograms = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { programs } = req.body

    if (!Array.isArray(programs)) {
      return res.status(400).json({
        status: 'error',
        message: 'Programs must be an array'
      })
    }

    const normalized = programs
      .map((p) => (typeof p === 'string' ? p.trim() : ''))
      .filter(Boolean)

    if (normalized.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No programs to add'
      })
    }

    const existing = await prisma.program.findMany({
      where: { companyId: company.id },
      select: { name: true }
    })

    const existingSet = new Set(existing.map((p) => p.name.toLowerCase()))
    const toCreate = Array.from(new Set(normalized.map((n) => n))).filter(
      (name) => !existingSet.has(name.toLowerCase())
    )

    if (toCreate.length > 0) {
      await prisma.program.createMany({
        data: toCreate.map((name) => ({
          name,
          companyId: company.id
        }))
      })
    }

    const updatedPrograms = await prisma.program.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    })

    await recalculateCompanyProgress(company.id)

    return res.status(200).json({
      status: 'success',
      message: 'Programs added successfully',
      data: updatedPrograms
    })
  } catch (error) {
    logger.error('add_programs_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add programs'
    })
  }
}


