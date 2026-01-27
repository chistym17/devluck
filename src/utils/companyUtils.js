import prisma from '../config/prisma.js'

export const getCompanyFromUser = async (userId) => {
  const company = await prisma.company.findUnique({
    where: { userId }
  })
  return company
}

export const requireCompany = async (req, res) => {
  const company = await getCompanyFromUser(req.user.id)
  if (!company) {
    res.status(404).json({
      status: 'error',
      message: 'Company profile not found'
    })
    return null
  }
  return company
}

export const checkResourceOwnership = (resource, companyId, resourceName = 'Resource') => {
  if (!resource) {
    return {
      error: {
        status: 404,
        message: `${resourceName} not found`
      }
    }
  }

  if (resource.companyId !== companyId) {
    return {
      error: {
        status: 403,
        message: `Access denied. You do not own this ${resourceName.toLowerCase()}`
      }
    }
  }

  return { error: null }
}

