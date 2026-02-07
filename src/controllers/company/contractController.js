import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany, checkResourceOwnership } from '../../utils/companyUtils.js'
import { createNotification } from '../../utils/notificationService.js'

export const listContracts = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const search = req.query.search || ''
    const status = req.query.status

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = {
      companyId: company.id,
      ...(search && {
        OR: [
          { contractTitle: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { inContractNumber: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status })
    }

    const [items, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contract.count({ where })
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
    return res.status(500).json({
      status: 'error',
      message: 'Failed to list contracts'
    })
  }
}

export const createContract = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const {
      contractTitle,
      email,
      name,
      inContractNumber,
      inContractList,
      currency,
      duration,
      monthlyAllowance,
      salary,
      workLocation,
      note,
      status,
      opportunityId
    } = req.body

    if (!contractTitle || !email || !inContractNumber || !currency || !duration || !status) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        requiredFields: ['contractTitle', 'email', 'inContractNumber', 'currency', 'duration', 'status']
      })
    }

    if (monthlyAllowance === undefined || monthlyAllowance === null) {
      return res.status(400).json({
        status: 'error',
        message: 'monthlyAllowance is required'
      })
    }

    // Look up user by email and get student name
    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase()
      },
      include: {
        student: true
      }
    })

    if (!user || !user.student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      })
    }

    const studentName = name || user.student.name

    if (opportunityId) {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId }
      })

      if (!opportunity) {
        return res.status(404).json({
          status: 'error',
          message: 'Opportunity not found'
        })
      }

      if (opportunity.companyId !== company.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. This opportunity does not belong to your company.'
        })
      }
    }

    const contract = await prisma.contract.create({
      data: {
        contractTitle,
        name: studentName,
        email: email.trim().toLowerCase(),
        inContractNumber,
        inContractList: inContractList || [],
        currency,
        duration,
        monthlyAllowance: parseFloat(monthlyAllowance),
        salary: salary !== undefined && salary !== null ? parseFloat(salary) : null,
        workLocation: workLocation || '',
        note: note || null,
        status,
        companyId: company.id,
        studentId: user.student.id,
        opportunityId: opportunityId || null
      }
    })

    createNotification({
      userId: user.id,
      type: 'CONTRACT_CREATED',
      title: 'New contract created',
      message: `A contract "${contractTitle}" has been created for you`
    }).catch(error => {
      logger.error('create_contract_notification_error', { error: error.message })
    })

    return res.status(201).json({
      status: 'success',
      data: contract
    })
  } catch (error) {
    logger.error('create_contract_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create contract'
    })
  }
}

export const getContractById = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const contract = await prisma.contract.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(contract, company.id, 'Contract')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    return res.status(200).json({
      status: 'success',
      data: contract
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get contract'
    })
  }
}

export const updateContract = async (req, res) => {
  try {
    console.log('=== UPDATE CONTRACT API START ===')
    console.log('Request params:', req.params)
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    
    const company = await requireCompany(req, res)
    if (!company) {
      console.log('Company check failed - returning early')
      return
    }
    console.log('Company ID:', company.id)

    const { id } = req.params
    console.log('Contract ID to update:', id)
    
    const {
      contractTitle,
      name,
      email,
      inContractNumber,
      inContractList,
      currency,
      duration,
      monthlyAllowance,
      workLocation,
      note,
      status,
      salary
    } = req.body

    console.log('Extracted fields:', {
      contractTitle,
      name,
      email,
      inContractNumber,
      inContractList,
      currency,
      duration,
      monthlyAllowance,
      salary,
      workLocation,
      note,
      status
    })

    console.log('Fetching contract from database...')
    const exists = await prisma.contract.findUnique({
      where: { id }
    })
    console.log('Contract found:', exists ? 'Yes' : 'No')
    if (exists) {
      console.log('Existing contract companyId:', exists.companyId)
    }

    const ownershipCheck = checkResourceOwnership(exists, company.id, 'Contract')
    if (ownershipCheck.error) {
      console.log('Ownership check failed:', ownershipCheck.error.message)
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }
    console.log('Ownership check passed')

    console.log('Building updateData object...')
    const updateData = {}
    if (contractTitle !== undefined) {
      updateData.contractTitle = contractTitle
      console.log('Adding contractTitle:', contractTitle)
    }
    if (name !== undefined) {
      updateData.name = name
      console.log('Adding name:', name)
    }
    if (email !== undefined) {
      updateData.email = email ? email.trim().toLowerCase() : null
      console.log('Adding email:', updateData.email)
    }
    if (inContractNumber !== undefined) {
      updateData.inContractNumber = inContractNumber
      console.log('Adding inContractNumber:', inContractNumber)
    }
    if (inContractList !== undefined) {
      updateData.inContractList = inContractList
      console.log('Adding inContractList:', inContractList)
    }
    if (currency !== undefined) {
      updateData.currency = currency
      console.log('Adding currency:', currency)
    }
    if (duration !== undefined) {
      updateData.duration = duration
      console.log('Adding duration:', duration)
    }
    if (monthlyAllowance !== undefined) {
      updateData.monthlyAllowance = parseFloat(monthlyAllowance)
      console.log('Adding monthlyAllowance:', updateData.monthlyAllowance)
    }
    if (salary !== undefined) {
      updateData.salary = salary !== null ? parseFloat(salary) : null
      console.log('Adding salary:', updateData.salary)
    }
    if (workLocation !== undefined) {
      updateData.workLocation = workLocation
      console.log('Adding workLocation:', workLocation)
    }
    if (note !== undefined) {
      updateData.note = note
      console.log('Adding note:', note)
    }
    if (status !== undefined) {
      updateData.status = status
      console.log('Adding status:', status)
    }

    console.log('Final updateData:', JSON.stringify(updateData, null, 2))
    console.log('Number of fields to update:', Object.keys(updateData).length)

    console.log('Attempting to update contract in database...')
    const contract = await prisma.contract.update({
      where: { id },
      data: updateData
    })
    console.log('Contract updated successfully')
    console.log('Updated contract:', JSON.stringify(contract, null, 2))

    if (contract.studentId) {
      prisma.student
        .findUnique({
          where: { id: contract.studentId },
          select: { userId: true }
        })
        .then(student => {
          if (!student || !student.userId) return
          return createNotification({
            userId: student.userId,
            type: 'CONTRACT_UPDATED',
            title: 'Contract updated',
            message: `Your contract "${contract.contractTitle}" has been updated${status !== undefined ? ` - Status: ${status}` : ''}`
          })
        })
        .catch(error => {
          logger.error('update_contract_notification_error', { error: error.message })
        })
    }

    console.log('=== UPDATE CONTRACT API SUCCESS ===')
    return res.status(200).json({
      status: 'success',
      data: contract
    })
  } catch (error) {
    console.log('=== UPDATE CONTRACT API ERROR ===')
    console.log('Error message:', error.message)
    console.log('Error stack:', error.stack)
    console.log('Error name:', error.name)
    if (error.code) {
      console.log('Error code:', error.code)
    }
    if (error.meta) {
      console.log('Error meta:', JSON.stringify(error.meta, null, 2))
    }
    console.log('=== END ERROR LOG ===')
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update contract'
    })
  }
}

export const deleteContract = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const exists = await prisma.contract.findUnique({
      where: { id }
    })

    const ownershipCheck = checkResourceOwnership(exists, company.id, 'Contract')
    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({
        status: 'error',
        message: ownershipCheck.error.message
      })
    }

    if (exists.studentId) {
      prisma.student
        .findUnique({
          where: { id: exists.studentId },
          select: { userId: true }
        })
        .then(student => {
          if (!student || !student.userId) return
          return createNotification({
            userId: student.userId,
            type: 'CONTRACT_DELETED',
            title: 'Contract deleted',
            message: `Contract "${exists.contractTitle}" has been deleted`
          })
        })
        .catch(error => {
          logger.error('delete_contract_notification_error', { error: error.message })
        })
    }

    await prisma.contract.delete({
      where: { id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Contract deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete contract'
    })
  }
}

export const getContractStats = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const where = {
      companyId: company.id
    }

    const [total, running, completed] = await Promise.all([
      prisma.contract.count({ where }),
      prisma.contract.count({ where: { ...where, status: 'Running' } }),
      prisma.contract.count({ where: { ...where, status: 'Completed' } })
    ])

    const other = total - running - completed

    return res.status(200).json({
      status: 'success',
      data: {
        total,
        running,
        completed,
        other
      }
    })
  } catch (error) {
    logger.error('get_contract_stats_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get contract statistics'
    })
  }
}

export const getEmployees = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const contracts = await prisma.contract.findMany({
      where: {
        companyId: company.id,
        studentId: { not: null }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileComplete: true,
            status: true,
            availability: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const employees = contracts.map(contract => ({
      id: contract.id,
      contractTitle: contract.contractTitle,
      contractNumber: contract.inContractNumber,
      status: contract.status,
      student: contract.student ? {
        id: contract.student.id,
        name: contract.student.name,
        email: contract.student.email,
        image: contract.student.image,
        profileComplete: contract.student.profileComplete,
        status: contract.student.status,
        availability: contract.student.availability
      } : null
    }))

    return res.status(200).json({
      status: 'success',
      data: employees
    })
  } catch (error) {
    logger.error('get_employees_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get employees'
    })
  }
}


