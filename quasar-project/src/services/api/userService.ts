import type { User, UserStatus, DirectMessage } from 'src/models'
import { mockUsers, mockDirectMessages, CURRENT_USER_ID } from '../mock/mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  async getCurrentUser(): Promise<User> {
    await delay(50)
    const user = mockUsers.find(u => u.id === CURRENT_USER_ID)
    if (!user) throw new Error('User not found')
    return user
  },

  async getAllUsers(): Promise<User[]> {
    await delay(100)
    return mockUsers
  },

  async getUserById(userId: string): Promise<User | null> {
    await delay(50)
    return mockUsers.find(u => u.id === userId) || null
  },

  async updateStatus(status: UserStatus): Promise<void> {
    await delay(100)
    const user = mockUsers.find(u => u.id === CURRENT_USER_ID)
    if (user) user.status = status
  },

  async getDirectMessages(): Promise<DirectMessage[]> {
    await delay(100)
    return mockDirectMessages
  },

  async createOrGetDM(userId: string): Promise<DirectMessage> {
    await delay(150)
    const existing = mockDirectMessages.find(dm => dm.userId === userId)
    if (existing) return existing
    const newDM: DirectMessage = { id: `dm-${Date.now()}`, userId, lastMessageAt: Date.now() }
    mockDirectMessages.push(newDM)
    return newDM
  },
}

