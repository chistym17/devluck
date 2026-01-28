import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { createNotification } from '../../utils/notificationService.js'

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  )
}

export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      })
    }

    if (!role || !['STUDENT', 'COMPANY'].includes(role.toUpperCase())) {
      return res.status(400).json({
        status: 'error',
        message: 'Role is required and must be either STUDENT or COMPANY'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userRole = role.toUpperCase()

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: userRole,
        ...(userRole === 'COMPANY' && {
          company: {
            create: {
              name: email.split('@')[0] || 'New Company',
              status: 'Verified',
              progress: 0
            }
          }
        }),
        ...(userRole === 'STUDENT' && {
          student: {
            create: {
              name: normalizedEmail.split('@')[0] || 'New Student',
              email: normalizedEmail,
              profileComplete: 0
            }
          }
        })
      }
    })

    createNotification({
      userId: user.id,
      type: 'WELCOME',
      title: 'Welcome to DevLuck!',
      message: userRole === 'STUDENT' 
        ? 'Welcome! Complete your profile to get started and discover amazing opportunities.'
        : 'Welcome! Complete your company profile to start posting opportunities and finding talent.'
    }).catch(error => {
      logger.error('welcome_notification_error', { error: error.message })
    })

    const token = generateToken(user)

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (err) {
    logger.error('signup_failed', { error: err.message, stack: err.stack })
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    const token = generateToken(user)

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (err) {
    logger.error('login_failed', { error: err.message, stack: err.stack })
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}

export const logout = async (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  })
}

export const me = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Current user retrieved successfully',
      data: {
        user
      }
    })
  } catch (err) {
    logger.error('me_failed', { error: err.message, stack: err.stack })
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}


