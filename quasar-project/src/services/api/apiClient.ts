import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

const API_BASE_URL = 'http://localhost:3333'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register')
      
      if (currentPath !== '/login' && currentPath !== '/signup' && !isAuthEndpoint) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('current_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

