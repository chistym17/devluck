import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'

export const getTopApplicants = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const search = req.query.search || ''

    const safePage = page < 1 ? 1 : page
    const safeLimit = limit < 1 ? 10 : Math.min(limit, 50)
    const skip = (safePage - 1) * safeLimit

    const applications = await prisma.application.findMany({
      where: {
        opportunity: {
          companyId: company.id
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
            profileRanking: true,
            profileComplete: true,
            email: true,
            availability: true,
            status: true,
            salaryExpectation: true
          }
        }
      }
    })

    const groupedByStudent = {}
    
    applications.forEach(app => {
      if (!app.student) return
      
      const studentId = app.studentId
      if (!groupedByStudent[studentId]) {
        groupedByStudent[studentId] = {
          student: app.student,
          applicationCount: 0
        }
      }
      groupedByStudent[studentId].applicationCount++
    })

    let topApplicants = Object.values(groupedByStudent).map(item => ({
      ...item.student,
      applicationCount: item.applicationCount
    }))

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      topApplicants = topApplicants.filter(applicant =>
        applicant.name?.toLowerCase().includes(searchLower) ||
        applicant.id?.toLowerCase().includes(searchLower) ||
        applicant.email?.toLowerCase().includes(searchLower)
      )
    }

    topApplicants.sort((a, b) => {
      if (b.applicationCount !== a.applicationCount) {
        return b.applicationCount - a.applicationCount
      }
      return (a.name || '').localeCompare(b.name || '')
    })

    const total = topApplicants.length
    const paginatedApplicants = topApplicants.slice(skip, skip + safeLimit)

    return res.status(200).json({
      status: 'success',
      data: {
        items: paginatedApplicants,
        total,
        page: safePage,
        pageSize: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    })
  } catch (error) {
    logger.error('get_top_applicants_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get top applicants'
    })
  }
}

export const getTopApplicantById = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { studentId } = req.params

    const hasApplied = await prisma.application.findFirst({
      where: {
        studentId,
        opportunity: {
          companyId: company.id
        }
      }
    })

    if (!hasApplied) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. This student has not applied to any of your opportunities.'
      })
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        experiences: true,
        educations: true,
        languages: true,
        portfolios: true,
        addresses: {
          take: 1
        }
      }
    })

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      })
    }

    const applicationCount = await prisma.application.count({
      where: {
        studentId,
        opportunity: {
          companyId: company.id
        }
      }
    })

    return res.status(200).json({
      status: 'success',
      data: {
        ...student,
        applicationCount
      }
    })
  } catch (error) {
    logger.error('get_top_applicant_by_id_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get applicant details'
    })
  }
}

