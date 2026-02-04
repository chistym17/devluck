import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'

export const getTopCompanies = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const search = req.query.search || ''

    const safePage = page < 1 ? 1 : page
    const safeLimit = limit < 1 ? 10 : Math.min(limit, 50)
    const skip = (safePage - 1) * safeLimit

    const opportunities = await prisma.opportunity.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            address: true,
            phoneNumber: true,
            status: true,
            industry: true,
            location: true,
            website: true,
            description: true,
            size: true,
            addresses: {
              take: 1,
              select: {
                address: true
              }
            },
            _count: {
              select: {
                contracts: true
              }
            }
          }
        }
      }
    })

    const groupedByCompany = {}
    
    opportunities.forEach(opp => {
      if (!opp.company) return
      
      const companyId = opp.companyId
      if (!groupedByCompany[companyId]) {
        groupedByCompany[companyId] = {
          company: {
            ...opp.company,
            employeeNumber: opp.company._count.contracts
          },
          opportunityCount: 0
        }
      }
      groupedByCompany[companyId].opportunityCount++
    })

    let topCompanies = Object.values(groupedByCompany).map(item => ({
      ...item.company,
      opportunityCount: item.opportunityCount
    }))

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      topCompanies = topCompanies.filter(comp =>
        comp.name?.toLowerCase().includes(searchLower) ||
        comp.id?.toLowerCase().includes(searchLower) ||
        comp.phoneNumber?.toLowerCase().includes(searchLower) ||
        comp.address?.toLowerCase().includes(searchLower) ||
        comp.location?.toLowerCase().includes(searchLower) ||
        (comp.addresses && comp.addresses.some(addr => addr.address?.toLowerCase().includes(searchLower)))
      )
    }

    topCompanies.sort((a, b) => {
      if (b.opportunityCount !== a.opportunityCount) {
        return b.opportunityCount - a.opportunityCount
      }
      return (a.name || '').localeCompare(b.name || '')
    })

    const total = topCompanies.length
    const paginatedCompanies = topCompanies.slice(skip, skip + safeLimit)

    return res.status(200).json({
      status: 'success',
      data: {
        items: paginatedCompanies,
        total,
        page: safePage,
        pageSize: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    })
  } catch (error) {
    logger.error('get_top_companies_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get top companies'
    })
  }
}

export const getTopCompanyById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    const { companyId } = req.params

    const targetCompany = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        addresses: true,
        programs: {
          select: {
            id: true,
            name: true
          }
        },
        contracts: {
          where: {
            studentId: {
              not: null
            }
          },
          select: {
            id: true,
            contractTitle: true,
            status: true,
            inContractNumber: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            contracts: true
          }
        }
      }
    })

    if (!targetCompany) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      })
    }

    const opportunityCount = await prisma.opportunity.count({
      where: {
        companyId: companyId
      }
    })

    logger.info('get_top_company_by_id_success', { 
      companyId, 
      addressesCount: targetCompany.addresses?.length || 0,
      programsCount: targetCompany.programs?.length || 0,
      employeesCount: targetCompany.contracts?.length || 0
    })

    const employees = targetCompany.contracts.map(contract => ({
      id: contract.id,
      contractTitle: contract.contractTitle,
      status: contract.status,
      contractNumber: contract.inContractNumber,
      student: contract.student
    }))

    return res.status(200).json({
      status: 'success',
      data: {
        ...targetCompany,
        employees,
        opportunityCount
      }
    })
  } catch (error) {
    logger.error('get_top_company_by_id_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get company details'
    })
  }
}

