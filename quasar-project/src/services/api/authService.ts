import { apiClient } from './apiClient'
import type { UserStatus } from 'src/models'

export interface LoginCredentials {
  emailOrUsername: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    fullName: string
    username: string
    email: string
    avatar?: string
    status: UserStatus
  }
  token: string
}

export interface UserResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    fullName: string
    username: string
    email: string
    avatar?: string
    status: UserStatus
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('current_user', JSON.stringify(data.user))
    return data
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('current_user', JSON.stringify(data.user))
    return data
  },

  async getCurrentUser(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/auth/me')
    localStorage.setItem('current_user', JSON.stringify(data.user))
    return data
  },

  async updateStatus(status: UserStatus): Promise<UserResponse> {
    const { data } = await apiClient.patch<UserResponse>('/auth/status', { status })
    localStorage.setItem('current_user', JSON.stringify(data.user))
    return data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  getStoredUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('current_user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  },
}

