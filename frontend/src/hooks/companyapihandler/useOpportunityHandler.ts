"use client"

import { useState, useCallback } from 'react'
import { api } from '@/src/lib/api'

interface OpportunityData {
  title: string
  type: string
  timeLength: string
  currency: string
  allowance?: string
  location?: string
  description: string
  details?: string
  skills?: string[]
  whyYouWillLoveWorkingHere?: string[]
  benefits?: string[]
  keyResponsibilities?: string[]
  startDate?: string
}

interface Opportunity extends OpportunityData {
  id: string
  applicantCount?: number
  createdAt: string
  updatedAt: string
}

interface ListOpportunitiesResponse {
  items: Opportunity[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface RecentOpportunitiesResponse {
  items: Opportunity[]
  limit: number
}

interface UseOpportunityHandlerReturn {
  opportunities: Opportunity[]
  opportunity: Opportunity | null
  loading: boolean
  error: string | null
  createOpportunity: (data: OpportunityData) => Promise<Opportunity>
  updateOpportunity: (id: string, data: Partial<OpportunityData>) => Promise<Opportunity>
  deleteOpportunity: (id: string) => Promise<void>
  getOpportunityById: (id: string) => Promise<Opportunity>
  listOpportunities: (page?: number, pageSize?: number) => Promise<ListOpportunitiesResponse>
  getRecentOpportunities: (limit?: number) => Promise<RecentOpportunitiesResponse>
  clearError: () => void
}

export const useOpportunityHandler = (): UseOpportunityHandlerReturn => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const createOpportunity = useCallback(async (data: OpportunityData): Promise<Opportunity> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<{ status: string; data: Opportunity }>('/company/opportunities', data)
      return response.data.data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to create opportunity'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOpportunity = useCallback(
    async (id: string, data: Partial<OpportunityData>): Promise<Opportunity> => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.put<{ status: string; data: Opportunity }>(`/company/opportunities/${id}`, data)
        return response.data.data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to update opportunity'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteOpportunity = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/company/opportunities/${id}`)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to delete opportunity'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const getOpportunityById = useCallback(async (id: string): Promise<Opportunity> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<{ status: string; data: Opportunity }>(`/company/opportunities/${id}`)
      setOpportunity(response.data.data)
      return response.data.data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to get opportunity'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const listOpportunities = useCallback(
    async (page: number = 1, pageSize: number = 10): Promise<ListOpportunitiesResponse> => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get<{ status: string; data: ListOpportunitiesResponse }>('/company/opportunities', {
          params: { page, pageSize }
        })
        const items = response.data.data?.items || []
        setOpportunities(items)
        return response.data.data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to list opportunities'
        setError(errorMessage)
        setOpportunities([])
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getRecentOpportunities = useCallback(
    async (limit: number = 5): Promise<RecentOpportunitiesResponse> => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get<{ status: string; data: RecentOpportunitiesResponse }>(
          '/company/opportunities/recent',
          {
            params: { limit }
          }
        )
        const items = response.data.data?.items || []
        setOpportunities(items)
        return response.data.data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to get recent opportunities'
        setError(errorMessage)
        setOpportunities([])
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    opportunities,
    opportunity,
    loading,
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunityById,
    listOpportunities,
    getRecentOpportunities,
    clearError
  }
}

