import type { User, UserStatus } from 'src/models'
import { apiClient } from './apiClient'

export const userService = {
  async getAllUsers(): Promise<User[]> {
    // TODO: Implement users endpoint on backend
    // For now return empty array, users are loaded with channels/messages
    return []
  },

  async getUserById(userId: string): Promise<User | null> {
    return null
  },

  async searchUsers(query: string): Promise<User[]> {
    try {
      const { data } = await apiClient.get<{ users: Array<{
        id: string
        username: string
        firstName: string
        lastName: string
        fullName: string
        avatar?: string
        status: UserStatus
      }> }>('/users/search', {
        params: { q: query }
      })

      return data.users.map(u => ({
        id: u.id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: u.fullName,
        status: u.status,
        ...(u.avatar && { avatar: u.avatar }),
      }))
    } catch (error) {
      console.error('Failed to search users:', error)
      return []
    }
  },
}

