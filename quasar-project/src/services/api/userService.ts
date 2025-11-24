import type { User, UserStatus, DirectMessage } from 'src/models'
import { apiClient } from './apiClient'

interface DirectMessageResponse {
  id: string
  userId: string
  userName: string
  userUsername: string
  userAvatar?: string
  userStatus: UserStatus
  lastMessageAt: number | null
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    // TODO: Implement users endpoint on backend
    // For now return empty array, users are loaded with channels/messages
    return []
  },

  async getUserById(userId: string): Promise<User | null> {
    // TODO: Implement get user by id endpoint
    return null
  },

  async getDirectMessages(): Promise<{ directMessages: DirectMessage[], users: User[] }> {
    try {
      const { data } = await apiClient.get<{ directMessages: DirectMessageResponse[] }>('/direct-messages')
      
      const directMessages = data.directMessages.map(dm => ({
        id: dm.id,
        userId: dm.userId,
        ...(dm.lastMessageAt && { lastMessageAt: dm.lastMessageAt }),
      }))

      const users: User[] = data.directMessages.map(dm => {
        const user: User = {
          id: dm.userId,
          username: dm.userUsername,
          firstName: dm.userName.split(' ')[0] || dm.userUsername,
          lastName: dm.userName.split(' ').slice(1).join(' ') || '',
          fullName: dm.userName,
          status: dm.userStatus,
        }
        if (dm.userAvatar) {
          user.avatar = dm.userAvatar
        }
        return user
      })

      return { directMessages, users }
    } catch (error) {
      console.error('Failed to fetch direct messages:', error)
      return { directMessages: [], users: [] }
    }
  },

  async createOrGetDM(userId: string): Promise<DirectMessage> {
    const { data } = await apiClient.post<{ directMessage: DirectMessageResponse }>('/direct-messages', { userId })
    return {
      id: data.directMessage.id,
      userId: data.directMessage.userId,
      ...(data.directMessage.lastMessageAt && { lastMessageAt: data.directMessage.lastMessageAt }),
    }
  },
}

