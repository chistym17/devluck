import prisma from '../../config/prisma.js'
import { requireCompany, checkResourceOwnership } from '../../utils/companyUtils.js'

export const listContractTemplates = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const search = req.query.search || ''

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = {
      companyId: company.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { contractTitle: { contains: search, mode: 'insensitive' } }
        ]
      })
      }

    const [items, total] = await Promise.all([
      prisma.contractTemplate.findMany({
        where,
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contractTemplate.count({ where })
    ])

    return res.status(200).json({
      status: 'success',
      data: {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages: Math.ceil(total / safePageSize) || 1
      }
    })
  } catch (error) {
    console.error('❌ Error in listContractTemplates:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list contract templates',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const createContractTemplate = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const {
      name,
      contractTitle,
      content,
      currency,
      duration,
      monthlyAllowance,
      workLocation,
      fields,
      status
    } = req.body

    if (!name || !contractTitle) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        requiredFields: ['name', 'contractTitle']
      })
    }

    const template = await prisma.contractTemplate.create({
      data: {
        name,
        contractTitle,
        content: content || null,
        currency: currency || null,
        duration: duration || null,
        monthlyAllowance: monthlyAllowance !== undefined && monthlyAllowance !== null ? parseFloat(monthlyAllowance) : null,
        workLocation: workLocation || null,
        fields: fields || null,
        status: status || 'Active',
        companyId: company.id
      }
    })

    return res.status(201).json({
      status: 'success',
      data: template
    })
  } catch (error) {
    console.error('❌ Error in createContractTemplate:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create contract template',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const getContractTemplateById = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing template ID'
      })
    }

    const template = await prisma.contractTemplate.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(template, company.id, 'Contract template')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({
      status: 'success',
      data: template
    })
  } catch (error) {
    console.error('❌ Error in getContractTemplateById:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get contract template',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const updateContractTemplate = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const {
      name,
      contractTitle,
      content,
      currency,
      duration,
      monthlyAllowance,
      workLocation,
      fields,
      status
    } = req.body

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing template ID'
      })
    }

    const existingTemplate = await prisma.contractTemplate.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingTemplate, company.id, 'Contract template')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (contractTitle !== undefined) updateData.contractTitle = contractTitle
    if (content !== undefined) updateData.content = content
    if (currency !== undefined) updateData.currency = currency
    if (duration !== undefined) updateData.duration = duration
    if (monthlyAllowance !== undefined) updateData.monthlyAllowance = monthlyAllowance !== null ? parseFloat(monthlyAllowance) : null
    if (workLocation !== undefined) updateData.workLocation = workLocation
    if (fields !== undefined) updateData.fields = fields
    if (status !== undefined) updateData.status = status

    const updatedTemplate = await prisma.contractTemplate.update({
      where: { id },
      data: updateData
    })

    return res.status(200).json({
      status: 'success',
      data: updatedTemplate
    })
  } catch (error) {
    console.error('❌ Error in updateContractTemplate:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update contract template',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const deleteContractTemplate = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing template ID'
      })
    }

    const existingTemplate = await prisma.contractTemplate.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(existingTemplate, company.id, 'Contract template')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    await prisma.contractTemplate.delete({
      where: { id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Contract template deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error in deleteContractTemplate:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete contract template',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const getContractTemplateStats = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    // Single query: fetch all templates with only needed fields
    const templates = await prisma.contractTemplate.findMany({
      where: { companyId: company.id },
      select: {
        status: true,
        createdAt: true
      }
    })

    // Calculate stats in JavaScript (much faster than 8 DB queries)
    const stats = {
      total: templates.length,
      active: 0,
      inactive: 0,
      draft: 0,
      latestActive: null,
      latestInactive: null,
      latestDraft: null,
      latest: null
    }

    // Single pass through templates to calculate all stats
    templates.forEach(template => {
      // Count by status
      if (template.status === 'Active') {
        stats.active++
        if (!stats.latestActive || template.createdAt > stats.latestActive) {
          stats.latestActive = template.createdAt
        }
      } else if (template.status === 'Inactive') {
        stats.inactive++
        if (!stats.latestInactive || template.createdAt > stats.latestInactive) {
          stats.latestInactive = template.createdAt
        }
      } else if (template.status === 'Draft') {
        stats.draft++
        if (!stats.latestDraft || template.createdAt > stats.latestDraft) {
          stats.latestDraft = template.createdAt
        }
      }

      // Track overall latest
      if (!stats.latest || template.createdAt > stats.latest) {
        stats.latest = template.createdAt
      }
    })

    return res.status(200).json({
      status: 'success',
      data: stats
    })
  } catch (error) {
    console.error('❌ Error in getContractTemplateStats:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get contract template stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}


