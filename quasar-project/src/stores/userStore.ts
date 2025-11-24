import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'src/models'
import { userService } from 'src/services/api'

export const useUserStore = defineStore('users', () => {
  const users = ref<Map<string, User>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllUsers() {
    // Users are populated from messages and channels
    // No need to fetch all users separately for now
    isLoading.value = false
  }

  function addUser(user: User) {
    users.value.set(user.id, user)
  }

  function addUsers(userList: User[]) {
    userList.forEach(user => users.value.set(user.id, user))
  }

  async function fetchUserById(userId: string) {
    if (users.value.has(userId)) return users.value.get(userId)!
    try {
      const user = await userService.getUserById(userId)
      if (user) users.value.set(userId, user)
      return user
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch user'
      throw e
    }
  }

  function getUserById(userId: string): User | undefined {
    return users.value.get(userId)
  }

  function findUserByName(name: string): User | undefined {
    return Array.from(users.value.values()).find(u => u.fullName.toLowerCase() === name.toLowerCase())
  }

  function findUserByUsername(username: string): User | undefined {
    return Array.from(users.value.values()).find(u => u.username.toLowerCase() === username.toLowerCase())
  }

  return { users, isLoading, error, fetchAllUsers, fetchUserById, getUserById, findUserByName, findUserByUsername, addUser, addUsers }
})

