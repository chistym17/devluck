import logger from '../utils/logger.js'

export const requestLogger = (req, res, next) => {
  const start = Date.now()
  const { method, originalUrl } = req

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info('request_completed', {
      method,
      url: originalUrl,
      statusCode: res.statusCode,
      durationMs: duration
    })
  })

  next()
}


