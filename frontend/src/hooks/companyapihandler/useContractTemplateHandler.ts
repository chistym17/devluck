"use client"

import { useState, useCallback } from 'react'
import { api } from '@/src/lib/api'

interface ContractTemplateData {
    name: string
    contractTitle: string
    content?: string
    currency?: string
    duration?: string
    monthlyAllowance?: number | string
    workLocation?: string
    fields?: any
    status?: string
}

interface ContractTemplate extends ContractTemplateData {
    id: string
    monthlyAllowance?: number
    status: string
    createdAt: string
    updatedAt: string
}

interface ListContractTemplatesResponse {
    items: ContractTemplate[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

interface ContractTemplateStats {
    total: number
    active: number
    inactive: number
    draft: number
    latestActive: string | null
    latestInactive: string | null
    latestDraft: string | null
    latest: string | null
}

interface UseContractTemplateHandlerReturn {
    contractTemplates: ContractTemplate[]
    contractTemplate: ContractTemplate | null
    loading: boolean
    error: string | null
    createContractTemplate: (data: ContractTemplateData) => Promise<ContractTemplate>
    updateContractTemplate: (id: string, data: Partial<ContractTemplateData>) => Promise<ContractTemplate>
    deleteContractTemplate: (id: string) => Promise<void>
    getContractTemplateById: (id: string) => Promise<ContractTemplate>
    listContractTemplates: (page?: number, pageSize?: number, search?: string) => Promise<ListContractTemplatesResponse>
    getContractTemplateStats: () => Promise<ContractTemplateStats>
    clearError: () => void
}

export const useContractTemplateHandler = (): UseContractTemplateHandlerReturn => {
    const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([])
    const [contractTemplate, setContractTemplate] = useState<ContractTemplate | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const createContractTemplate = useCallback(async (data: ContractTemplateData): Promise<ContractTemplate> => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post<{ status: string; data: ContractTemplate }>('/company/contract-templates', data)
            return response.data.data
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'Failed to create contract template'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateContractTemplate = useCallback(
        async (id: string, data: Partial<ContractTemplateData>): Promise<ContractTemplate> => {
            setLoading(true)
            setError(null)
            try {
                const response = await api.put<{ status: string; data: ContractTemplate }>(`/company/contract-templates/${id}`, data)
                return response.data.data
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.message || err.message || 'Failed to update contract template'
                setError(errorMessage)
                throw new Error(errorMessage)
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const deleteContractTemplate = useCallback(async (id: string): Promise<void> => {
        setLoading(true)
        setError(null)
        try {
            await api.delete(`/company/contract-templates/${id}`)
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'Failed to delete contract template'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const getContractTemplateById = useCallback(async (id: string): Promise<ContractTemplate> => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get<{ status: string; data: ContractTemplate }>(`/company/contract-templates/${id}`)
            setContractTemplate(response.data.data)
            return response.data.data
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'Failed to get contract template'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const listContractTemplates = useCallback(
        async (page: number = 1, pageSize: number = 10, search: string = ''): Promise<ListContractTemplatesResponse> => {
            setLoading(true)
            setError(null)
            try {
                const params: any = { page, pageSize }
                if (search) params.search = search

                const response = await api.get<{ status: string; data: ListContractTemplatesResponse }>('/company/contract-templates', {
                    params
                })
                const items = response.data.data?.items || []
                setContractTemplates(items)
                return response.data.data
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.message || err.message || 'Failed to list contract templates'
                setError(errorMessage)
                setContractTemplates([])
                throw new Error(errorMessage)
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const getContractTemplateStats = useCallback(async (): Promise<ContractTemplateStats> => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get<{ status: string; data: ContractTemplateStats }>('/company/contract-templates/stats')
            return response.data.data
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'Failed to get contract template stats'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        contractTemplates,
        contractTemplate,
        loading,
        error,
        createContractTemplate,
        updateContractTemplate,
        deleteContractTemplate,
        getContractTemplateById,
        listContractTemplates,
        getContractTemplateStats,
        clearError
    }
}
