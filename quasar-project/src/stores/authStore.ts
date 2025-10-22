import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserStatus } from 'src/models'
import { userService } from 'src/services/api'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const currentUserId = computed(() => currentUser.value?.id || '')
  const userStatus = computed(() => currentUser.value?.status || 'offline')

  async function fetchCurrentUser() {
    isLoading.value = true
    error.value = null
    try {
      currentUser.value = await userService.getCurrentUser()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch user'
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
      await userService.updateStatus(status)
    } catch (e) {
      currentUser.value.status = oldStatus
      error.value = e instanceof Error ? e.message : 'Failed to update status'
      throw e
    }
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, isLoading, error, isAuthenticated, currentUserId, userStatus, fetchCurrentUser, updateUserStatus, logout }
})

