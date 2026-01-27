import prisma from '../config/prisma.js'

export const calculateCompanyProgress = ({ company, programCount, addressCount }) => {
  const total = 5
  let filled = 0

  if (company?.logo) filled += 1       // logo uploaded
  if (company?.description) filled += 1 // corporate/description added
  if ((programCount || 0) > 0) filled += 1
  if ((addressCount || 0) > 0) filled += 1
  if (company?.website || company?.industry || company?.size) filled += 1

  return Math.round((filled / total) * 100)
}

export const recalculateCompanyProgress = async (companyId) => {
  const [company, programCount, addressCount] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        logo: true,
        description: true,
        progress: true
      }
    }),
    prisma.program.count({ where: { companyId } }),
    prisma.address.count({ where: { companyId } })
  ])

  if (!company) return null

  const progress = calculateCompanyProgress({ company, programCount, addressCount })

  if (company.progress !== progress) {
    await prisma.company.update({
      where: { id: companyId },
      data: { progress }
    })
  }

  return progress
}


