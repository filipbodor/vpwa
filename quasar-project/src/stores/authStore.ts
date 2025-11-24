import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserStatus } from 'src/models'
import { authService } from 'src/services/api/authService'
import type { LoginCredentials, RegisterData } from 'src/services/api/authService'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const currentUserId = computed(() => currentUser.value?.id || '')
  const userStatus = computed(() => currentUser.value?.status || 'offline')

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      currentUser.value = response.user as User
      return response
    } catch (e: any) {
      error.value = e.response?.data?.errors?.[0]?.message || e.message || 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: RegisterData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.register(userData)
      currentUser.value = response.user as User
      return response
    } catch (e: any) {
      error.value = e.response?.data?.errors?.[0]?.message || e.message || 'Registration failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser() {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.getCurrentUser()
      currentUser.value = response.user as User
    } catch (e: any) {
      error.value = e.response?.data?.errors?.[0]?.message || e.message || 'Failed to fetch user'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateUserStatus(status: UserStatus) {
    if (!currentUser.value) return
    const oldStatus = currentUser.value.status
    currentUser.value.status = status
    try {
      const response = await authService.updateStatus(status)
      currentUser.value = response.user as User
    } catch (e: any) {
      currentUser.value.status = oldStatus
      error.value = e.response?.data?.errors?.[0]?.message || e.message || 'Failed to update status'
      throw e
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await authService.logout()
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      currentUser.value = null
      isLoading.value = false
    }
  }

  function initializeFromStorage() {
    const storedUser = authService.getStoredUser()
    if (storedUser && authService.isAuthenticated()) {
      currentUser.value = storedUser as User
    }
  }

  return { 
    currentUser, 
    isLoading, 
    error, 
    isAuthenticated, 
    currentUserId, 
    userStatus, 
    login,
    register,
    fetchCurrentUser, 
    updateUserStatus, 
    logout,
    initializeFromStorage
  }
})

