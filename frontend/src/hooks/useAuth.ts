"use client"

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/src/lib/api'

interface User {
  id: string
  email: string
  role: 'STUDENT' | 'COMPANY'
}

interface AuthResponse {
  status: string
  message: string
  data: {
    token: string
    user: User
  }
}

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  signup: (email: string, password: string, role: 'STUDENT' | 'COMPANY') => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
  clearError: () => void
}

const TOKEN_KEY = 'devluck_token'

const getUserFromToken = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    }
  } catch {
    return null
  }
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const tokenUser = getUserFromToken()
    if (tokenUser) {
      setUser(tokenUser)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signup = useCallback(async (email: string, password: string, role: 'STUDENT' | 'COMPANY') => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/signup', {
        email,
        password,
        role,
      })

      if (response.data.status === 'success' && response.data.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token)
        setUser(response.data.data.user)
        setIsAuthenticated(true)
      } else {
        throw new Error(response.data.message || 'Signup failed')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Signup failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      if (response.data.status === 'success' && response.data.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token)
        setUser(response.data.data.user)
        setIsAuthenticated(true)
      } else {
        throw new Error(response.data.message || 'Login failed')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/logout')
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [])

  return {
    user,
    isAuthenticated,
    signup,
    login,
    logout,
    loading,
    error,
    clearError,
  }
}

