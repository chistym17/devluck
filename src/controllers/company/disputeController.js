import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireCompany } from '../../utils/companyUtils.js'
import { createNotification } from '../../utils/notificationService.js'

// Company lists disputes on their contracts
export const listDisputes = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const page = parseInt(req.query.page, 10) || 1
        const pageSize = parseInt(req.query.pageSize, 10) || 10
        const status = req.query.status // Filter by status if provided

        const safePage = page < 1 ? 1 : page
        const safePageSize = pageSize < 1 ? 10 : Math.min(pageSize, 50)
        const skip = (safePage - 1) * safePageSize

        const where = {
            companyId: company.id,
            ...(status && { status })
        }

        const [items, total] = await Promise.all([
            prisma.dispute.findMany({
                where,
                include: {
                    contract: {
                        select: {
                            id: true,
                            contractTitle: true,
                            inContractNumber: true,
                            status: true,
                            duration: true,
                            monthlyAllowance: true,
                            currency: true
                        }
                    },
                    student: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                },
                skip,
                take: safePageSize,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.dispute.count({ where })
        ])

        return res.status(200).json({
            status: 'success',
            data: {
                items,
                total,
                page: safePage,
                pageSize: safePageSize,
                totalPages: Math.ceil(total / safePageSize) || 1
            }
        })
    } catch (error) {
        logger.error('list_company_disputes_error', { error: error.message })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to list disputes'
        })
    }
}

// Company gets a specific dispute by ID
export const getDisputeById = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const { id } = req.params

        const dispute = await prisma.dispute.findUnique({
            where: { id },
            include: {
                contract: {
                    select: {
                        id: true,
                        contractTitle: true,
                        inContractNumber: true,
                        status: true,
                        duration: true,
                        monthlyAllowance: true,
                        salary: true,
                        currency: true,
                        workLocation: true,
                        note: true,
                        createdDate: true
                    }
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        status: true,
                        availability: true
                    }
                }
            }
        })

        if (!dispute) {
            return res.status(404).json({
                status: 'error',
                message: 'Dispute not found'
            })
        }

        if (dispute.companyId !== company.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. This dispute does not belong to your company.'
            })
        }

        return res.status(200).json({
            status: 'success',
            data: dispute
        })
    } catch (error) {
        logger.error('get_company_dispute_error', { error: error.message })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get dispute'
        })
    }
}

// Company updates dispute status (marks as under review)
export const updateDisputeStatus = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const { id } = req.params
        const { status } = req.body

        // Validate status
        const validStatuses = ['UnderReview', 'Open']
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Status must be one of: ${validStatuses.join(', ')}`
            })
        }

        // Get dispute
        const dispute = await prisma.dispute.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        userId: true,
                        name: true
                    }
                },
                contract: {
                    select: {
                        contractTitle: true,
                        inContractNumber: true
                    }
                }
            }
        })

        if (!dispute) {
            return res.status(404).json({
                status: 'error',
                message: 'Dispute not found'
            })
        }

        if (dispute.companyId !== company.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            })
        }

        // Update status
        const updated = await prisma.dispute.update({
            where: { id },
            data: { status }
        })

        // Notify student
        try {
            await createNotification({
                userId: dispute.student.userId,
                type: 'DISPUTE_UPDATE',
                title: 'Dispute Status Updated',
                message: `Your dispute for contract "${dispute.contract.contractTitle}" has been marked as ${status}`,
                metadata: {
                    disputeId: id,
                    contractId: dispute.contractId,
                    status
                }
            })
        } catch (notifError) {
            logger.error('dispute_status_notification_error', { error: notifError.message })
        }

        return res.status(200).json({
            status: 'success',
            data: updated,
            message: 'Dispute status updated successfully'
        })
    } catch (error) {
        logger.error('update_dispute_status_error', { error: error.message })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update dispute status'
        })
    }
}

// Company resolves a dispute
export const resolveDispute = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const { id } = req.params
        const { resolution, newContractStatus } = req.body

        // Validation
        if (!resolution || resolution.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Resolution message is required'
            })
        }

        const validContractStatuses = ['Running', 'Completed', 'Cancelled']
        if (!newContractStatus || !validContractStatuses.includes(newContractStatus)) {
            return res.status(400).json({
                status: 'error',
                message: `Contract status must be one of: ${validContractStatuses.join(', ')}`
            })
        }

        // Get dispute
        const dispute = await prisma.dispute.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        userId: true,
                        name: true
                    }
                },
                contract: {
                    select: {
                        id: true,
                        contractTitle: true,
                        inContractNumber: true
                    }
                }
            }
        })

        if (!dispute) {
            return res.status(404).json({
                status: 'error',
                message: 'Dispute not found'
            })
        }

        if (dispute.companyId !== company.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            })
        }

        if (dispute.status === 'Resolved' || dispute.status === 'Rejected') {
            return res.status(400).json({
                status: 'error',
                message: 'This dispute has already been resolved or rejected'
            })
        }

        // Resolve dispute and update contract in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update dispute
            const resolved = await tx.dispute.update({
                where: { id },
                data: {
                    status: 'Resolved',
                    resolution: resolution.trim(),
                    resolvedBy: req.user.id,
                    resolvedAt: new Date()
                }
            })

            // Update contract status
            await tx.contract.update({
                where: { id: dispute.contractId },
                data: { status: newContractStatus }
            })

            return resolved
        })

        // Notify student
        try {
            await createNotification({
                userId: dispute.student.userId,
                type: 'DISPUTE_RESOLVED',
                title: 'Dispute Resolved',
                message: `Your dispute for contract "${dispute.contract.contractTitle}" has been resolved. ${company.name}: ${resolution}`,
                metadata: {
                    disputeId: id,
                    contractId: dispute.contractId,
                    resolution,
                    newContractStatus
                }
            })
        } catch (notifError) {
            logger.error('dispute_resolved_notification_error', { error: notifError.message })
        }

        logger.info('dispute_resolved', {
            disputeId: id,
            companyId: company.id,
            contractId: dispute.contractId,
            newContractStatus
        })

        return res.status(200).json({
            status: 'success',
            data: result,
            message: 'Dispute resolved successfully'
        })
    } catch (error) {
        logger.error('resolve_dispute_error', { error: error.message, stack: error.stack })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to resolve dispute'
        })
    }
}

// Company rejects a dispute
export const rejectDispute = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const { id } = req.params
        const { resolution } = req.body

        // Validation
        if (!resolution || resolution.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Rejection reason is required'
            })
        }

        // Get dispute
        const dispute = await prisma.dispute.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        userId: true,
                        name: true
                    }
                },
                contract: {
                    select: {
                        id: true,
                        contractTitle: true,
                        inContractNumber: true,
                        status: true
                    }
                }
            }
        })

        if (!dispute) {
            return res.status(404).json({
                status: 'error',
                message: 'Dispute not found'
            })
        }

        if (dispute.companyId !== company.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            })
        }

        if (dispute.status === 'Resolved' || dispute.status === 'Rejected') {
            return res.status(400).json({
                status: 'error',
                message: 'This dispute has already been resolved or rejected'
            })
        }

        // Reject dispute and restore contract status in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update dispute
            const rejected = await tx.dispute.update({
                where: { id },
                data: {
                    status: 'Rejected',
                    resolution: resolution.trim(),
                    resolvedBy: req.user.id,
                    resolvedAt: new Date()
                }
            })

            // Restore contract to previous status (remove Disputed)
            // Default to 'Running' if it was disputed
            const newStatus = dispute.contract.status === 'Disputed' ? 'Running' : dispute.contract.status
            await tx.contract.update({
                where: { id: dispute.contractId },
                data: { status: newStatus }
            })

            return rejected
        })

        // Notify student
        try {
            await createNotification({
                userId: dispute.student.userId,
                type: 'DISPUTE_REJECTED',
                title: 'Dispute Rejected',
                message: `Your dispute for contract "${dispute.contract.contractTitle}" has been rejected. ${company.name}: ${resolution}`,
                metadata: {
                    disputeId: id,
                    contractId: dispute.contractId,
                    resolution
                }
            })
        } catch (notifError) {
            logger.error('dispute_rejected_notification_error', { error: notifError.message })
        }

        logger.info('dispute_rejected', {
            disputeId: id,
            companyId: company.id,
            contractId: dispute.contractId
        })

        return res.status(200).json({
            status: 'success',
            data: result,
            message: 'Dispute rejected'
        })
    } catch (error) {
        logger.error('reject_dispute_error', { error: error.message, stack: error.stack })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to reject dispute'
        })
    }
}

// Get dispute statistics
export const getDisputeStats = async (req, res) => {
    try {
        const company = await requireCompany(req, res)
        if (!company) return

        const where = {
            companyId: company.id
        }

        const [total, open, underReview, resolved, rejected] = await Promise.all([
            prisma.dispute.count({ where }),
            prisma.dispute.count({ where: { ...where, status: 'Open' } }),
            prisma.dispute.count({ where: { ...where, status: 'UnderReview' } }),
            prisma.dispute.count({ where: { ...where, status: 'Resolved' } }),
            prisma.dispute.count({ where: { ...where, status: 'Rejected' } })
        ])

        return res.status(200).json({
            status: 'success',
            data: {
                total,
                open,
                underReview,
                resolved,
                rejected,
                pending: open + underReview
            }
        })
    } catch (error) {
        logger.error('get_dispute_stats_error', { error: error.message })
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get dispute statistics'
        })
    }
}

