import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'

export const createUniversity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const {
      name,
      address,
      email,
      phoneNumber,
      description,
      corporate,
      website,
      image,
      programs,
      totalStudents,
      ugStudents,
      pgStudents,
      staff,
      totalDoctors,
      qsWorldRanking,
      qsRankingBySubject,
      qsSustainabilityRanking
    } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'University name is required'
      })
    }

    const university = await prisma.university.create({
      data: {
        name: name.trim(),
        address: address?.trim(),
        email: email?.trim(),
        phoneNumber: phoneNumber?.trim(),
        description: description?.trim(),
        corporate: corporate?.trim(),
        website: website?.trim(),
        image: image?.trim(),
        programs: programs || [],
        totalStudents: totalStudents || 0,
        ugStudents: ugStudents || 0,
        pgStudents: pgStudents || 0,
        staff: staff || 0,
        totalDoctors: totalDoctors || 0,
        qsWorldRanking: qsWorldRanking,
        qsRankingBySubject: qsRankingBySubject,
        qsSustainabilityRanking: qsSustainabilityRanking,
        companyId: company.id
      }
    })

    return res.status(201).json({
      status: 'success',
      data: university
    })
  } catch (error) {
    logger.error('create_university_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create university'
    })
  }
}

export const getUniversities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'name' } = req.query

    const safePage = parseInt(page, 10) || 1
    const safeLimit = parseInt(limit, 10) || 10
    const skip = (safePage - 1) * safeLimit

    const where = search.trim()
      ? {
          OR: [
            { name: { contains: search.trim(), mode: 'insensitive' } },
            { address: { contains: search.trim(), mode: 'insensitive' } },
            { description: { contains: search.trim(), mode: 'insensitive' } },
            { email: { contains: search.trim(), mode: 'insensitive' } },
            { phoneNumber: { contains: search.trim(), mode: 'insensitive' } }
          ]
        }
      : {}

    let orderBy = { name: 'asc' }
    if (sort === 'ranking') {
      orderBy = { qsWorldRanking: 'asc' }
    }

    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }),
      prisma.university.count({ where })
    ])

    return res.status(200).json({
      status: 'success',
      data: {
        items: universities,
        total,
        page: safePage,
        pageSize: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    })
  } catch (error) {
    logger.error('get_universities_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get universities'
    })
  }
}

export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    })

    if (!university) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: university
    })
  } catch (error) {
    logger.error('get_university_by_id_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get university'
    })
  }
}

export const updateUniversity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params
    const {
      name,
      address,
      email,
      phoneNumber,
      description,
      corporate,
      website,
      image,
      programs,
      totalStudents,
      ugStudents,
      pgStudents,
      staff,
      totalDoctors,
      qsWorldRanking,
      qsRankingBySubject,
      qsSustainabilityRanking
    } = req.body

    const existingUniversity = await prisma.university.findUnique({
      where: { id }
    })

    if (!existingUniversity) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      })
    }

    const university = await prisma.university.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(address !== undefined && { address: address?.trim() }),
        ...(email !== undefined && { email: email?.trim() }),
        ...(phoneNumber !== undefined && { phoneNumber: phoneNumber?.trim() }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(corporate !== undefined && { corporate: corporate?.trim() }),
        ...(website !== undefined && { website: website?.trim() }),
        ...(image !== undefined && { image: image?.trim() }),
        ...(programs !== undefined && { programs: programs }),
        ...(totalStudents !== undefined && { totalStudents: totalStudents }),
        ...(ugStudents !== undefined && { ugStudents: ugStudents }),
        ...(pgStudents !== undefined && { pgStudents: pgStudents }),
        ...(staff !== undefined && { staff: staff }),
        ...(totalDoctors !== undefined && { totalDoctors: totalDoctors }),
        ...(qsWorldRanking !== undefined && { qsWorldRanking: qsWorldRanking }),
        ...(qsRankingBySubject !== undefined && { qsRankingBySubject: qsRankingBySubject }),
        ...(qsSustainabilityRanking !== undefined && { qsSustainabilityRanking: qsSustainabilityRanking })
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    })

    return res.status(200).json({
      status: 'success',
      data: university
    })
  } catch (error) {
    logger.error('update_university_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update university'
    })
  }
}

export const deleteUniversity = async (req, res) => {
  try {
    const company = await requireCompany(req, res)
    if (!company) return

    const { id } = req.params

    const existingUniversity = await prisma.university.findUnique({
      where: { id }
    })

    if (!existingUniversity) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      })
    }

    await prisma.university.delete({
      where: { id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'University deleted successfully'
    })
  } catch (error) {
    logger.error('delete_university_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete university'
    })
  }
}

export const getUniversityStats = async (req, res) => {
  try {
    const totalUniversities = await prisma.university.count()

    return res.status(200).json({
      status: 'success',
      data: {
        totalUniversities
      }
    })
  } catch (error) {
    logger.error('get_university_stats_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get university statistics'
    })
  }
}

