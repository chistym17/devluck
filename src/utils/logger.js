const formatMessage = (level, message, meta) => {
  const base = {
    timestamp: new Date().toISOString(),
    level,
    message
  }

  if (meta && Object.keys(meta).length > 0) {
    base.meta = meta
  }

  return JSON.stringify(base)
}

const logger = {
  info: (message, meta = {}) => {
    console.log(formatMessage('info', message, meta))
  },
  warn: (message, meta = {}) => {
    console.warn(formatMessage('warn', message, meta))
  },
  error: (message, meta = {}) => {
    console.error(formatMessage('error', message, meta))
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, meta))
    }
  }
}

export default logger


