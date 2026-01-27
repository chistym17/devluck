import prisma from '../../config/prisma.js'

export const listDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10
    const companyId = req.query.companyId

    const safePage = page < 1 ? 1 : page
    const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
    const skip = (safePage - 1) * safePageSize

    const where = companyId ? { companyId } : {}

    const [items, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: safePageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.document.count({ where })
    ])

    return res.status(200).json({
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages: Math.ceil(total / safePageSize) || 1
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to list documents'
    })
  }
}

export const createDocument = async (req, res) => {
  try {
    const {
      fileName,
      fileUrl,
      fileType,
      fileSize,
      companyId
    } = req.body

    if (!fileName || !fileUrl || !fileType || fileSize === undefined) {
      return res.status(400).json({
        message: 'Missing required fields',
        requiredFields: ['fileName', 'fileUrl', 'fileType', 'fileSize']
      })
    }

    const document = await prisma.document.create({
      data: {
        fileName,
        fileUrl,
        fileType,
        fileSize: parseFloat(fileSize),
        companyId: companyId || null
      }
    })

    return res.status(201).json(document)
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create document'
    })
  }
}


