export const requireCompany = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    })
  }

  if (req.user.role !== 'COMPANY') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Company role required'
    })
  }

  return next()
}

export const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    })
  }

  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Student role required'
    })
  }

  return next()
}

