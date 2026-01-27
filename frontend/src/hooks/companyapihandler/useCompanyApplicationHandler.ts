"use client"

import { useState, useCallback } from 'react'
import { api } from '@/src/lib/api'

interface Student {
  id: string
  name: string
  description?: string
  status: string
  availability?: string
  profileRanking?: number
  profileComplete?: number
  skills?: Array<{
    skill: {
      id: string
      name: string
    }
  }>
  experiences?: any[]
  educations?: any[]
  languages?: any[]
  portfolios?: any[]
}

interface Opportunity {
  id: string
  title: string
  type: string
  companyId?: string
  company?: {
    id: string
    name: string
    logo?: string
  }
}

interface Application {
  id: string
  studentId: string
  opportunityId: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  appliedAt: string
  withdrawnAt?: string
  student?: Student
  opportunity?: Opportunity
  createdAt?: string
  updatedAt?: string
}

interface ListApplicationsResponse {
  items: Application[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface RecentApplicationsResponse {
  items: Application[]
  limit: number
}

interface EmailSuggestion {
  email: string
  id: string
  name: string
}

interface UseCompanyApplicationHandlerReturn {
  applications: Application[]
  application: Application | null
  student: Student | null
  loading: boolean
  error: string | null
  getAllApplications: (page?: number, pageSize?: number, status?: string, opportunityId?: string) => Promise<ListApplicationsResponse>
  getApplicationsForOpportunity: (opportunityId: string, page?: number, pageSize?: number, status?: string) => Promise<ListApplicationsResponse>
  getApplicationById: (id: string) => Promise<Application>
  getStudentProfileById: (studentId: string) => Promise<Student>
  searchStudentByName: (name: string) => Promise<Student>
  searchUserByEmail: (email: string) => Promise<EmailSuggestion[]>
  getRecentApplicants: (limit?: number) => Promise<RecentApplicationsResponse>
  updateApplicationStatus: (id: string, status: 'pending' | 'accepted' | 'rejected') => Promise<Application>
  deleteApplication: (id: string) => Promise<void>
  clearError: () => void
}

export const useCompanyApplicationHandler = (): UseCompanyApplicationHandlerReturn => {
  const [applications, setApplications] = useState<Application[]>([])
  const [application, setApplication] = useState<Application | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const getAllApplications = useCallback(
    async (page: number = 1, pageSize: number = 10, status?: string, opportunityId?: string): Promise<ListApplicationsResponse> => {
      setLoading(true)
      setError(null)
      try {
        const params: any = { page, limit: pageSize }
        if (status) params.status = status
        if (opportunityId) params.opportunityId = opportunityId

        const response = await api.get<{ status: string; data: ListApplicationsResponse }>('/api/company/applications', {
          params
        })
        const items = response.data.data?.items || []
        setApplications(items)
        return response.data.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to get applications'
        setError(errorMessage)
        setApplications([])
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getApplicationsForOpportunity = useCallback(
    async (opportunityId: string, page: number = 1, pageSize: number = 10, status?: string): Promise<ListApplicationsResponse> => {
      setLoading(true)
      setError(null)
      try {
        const params: any = { page, limit: pageSize }
        if (status) params.status = status

        const response = await api.get<{ status: string; data: ListApplicationsResponse }>(
          `/api/company/opportunities/${opportunityId}/applications`,
          { params }
        )
        const items = response.data.data?.items || []
        setApplications(items)
        return response.data.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to get applications for opportunity'
        setError(errorMessage)
        setApplications([])
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getApplicationById = useCallback(async (id: string): Promise<Application> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<{ status: string; data: Application }>(`/api/company/applications/${id}`)
      setApplication(response.data.data)
      return response.data.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get application'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const getStudentProfileById = useCallback(async (studentId: string): Promise<Student> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<{ status: string; data: Student }>(`/api/company/students/${studentId}`)
      setStudent(response.data.data)
      return response.data.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get student profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchStudentByName = useCallback(async (name: string): Promise<Student> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<{ status: string; data: Student }>('/api/company/students/search/by-name', {
        params: { name }
      })
      setStudent(response.data.data)
      return response.data.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to search student'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchUserByEmail = useCallback(async (email: string): Promise<EmailSuggestion[]> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<{ status: string; data: EmailSuggestion[] }>('/api/company/students/search/by-email', {
        params: { email }
      })
      return response.data.data || []
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to search user by email'
      setError(errorMessage)
      // Return empty array on error instead of throwing, so autocomplete can still work
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getRecentApplicants = useCallback(
    async (limit: number = 5): Promise<RecentApplicationsResponse> => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get<{ status: string; data: RecentApplicationsResponse }>(
          '/company/dashboard/recent-applicants',
          {
            params: { limit }
          }
        )
        const items = response.data.data?.items || []
        setApplications(items)
        return response.data.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to get recent applicants'
        setError(errorMessage)
        setApplications([])
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateApplicationStatus = useCallback(
    async (id: string, status: 'pending' | 'accepted' | 'rejected'): Promise<Application> => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.put<{ status: string; data: Application; message: string }>(
          `/api/company/applications/${id}/status`,
          { status }
        )
        setApplications(prev => prev.map(app => app.id === id ? response.data.data : app))
        if (application?.id === id) {
          setApplication(response.data.data)
        }
        return response.data.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update application status'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [application]
  )

  const deleteApplication = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/api/company/applications/${id}`)
      setApplications(prev => prev.filter(app => app.id !== id))
      if (application?.id === id) {
        setApplication(null)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete application'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [application])

  return {
    applications,
    application,
    student,
    loading,
    error,
    getAllApplications,
    getApplicationsForOpportunity,
    getApplicationById,
    getStudentProfileById,
    searchStudentByName,
    searchUserByEmail,
    getRecentApplicants,
    updateApplicationStatus,
    deleteApplication,
    clearError
  }
}

