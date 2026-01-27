import express from 'express'
import supabase from '../config/supabase.js'
import cloudinary from '../config/cloudinary.js'
import prisma from '../config/prisma.js'
import logger from '../utils/logger.js'

const router = express.Router()

router.get('/test-db', async (req, res) => {
  try {
    const { error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    res.json({
      status: 'success',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    logger.error('test_db_failed', { error: err.message, stack: err.stack })
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: err.message
    })
  }
})

router.get('/test-cloudinary', async (req, res) => {
  try {
    await cloudinary.api.ping()
    res.json({
      status: 'success',
      message: 'Cloudinary connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    logger.error('test_cloudinary_failed', { error: err.message, stack: err.stack })
    res.status(500).json({
      status: 'error',
      message: 'Cloudinary connection failed',
      error: err.message
    })
  }
})

router.get('/test-prisma', async (req, res) => {
  try {
    await prisma.$connect()
    const count = await prisma.dummy.count()
    res.json({
      status: 'success',
      message: 'Prisma connection successful',
      dummyTableCount: count,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    logger.error('test_prisma_failed', { error: err.message, stack: err.stack })
    res.status(500).json({
      status: 'error',
      message: 'Prisma connection failed',
      error: err.message
    })
  } finally {
    await prisma.$disconnect()
  }
})

export default router

