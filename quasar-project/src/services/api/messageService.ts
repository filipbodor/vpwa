import type { Message, Thread, User } from 'src/models'
import { apiClient } from './apiClient'

interface MessageResponse {
  id: string
  userId: string
  content: string
  createdAt: number
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    fullName: string
    avatar?: string
  }
}

interface MessagesResponse {
  messages: MessageResponse[]
  meta?: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export const messageService = {
  async getMessages(thread: Thread): Promise<{ messages: Message[], users: User[] }> {
    try {
      let response: { data: MessagesResponse }
      
      if (thread.type === 'channel') {
        response = await apiClient.get<MessagesResponse>(`/channels/${thread.id}/messages`)
      } else {
        response = await apiClient.get<MessagesResponse>(`/direct-messages/${thread.id}/messages`)
      }

      const messages = response.data.messages.map(msg => ({
        id: msg.id,
        senderId: msg.userId,
        text: msg.content,
        createdAt: msg.createdAt,
      }))

      const users: User[] = response.data.messages.map(msg => {
        const user: User = {
          id: msg.user.id,
          username: msg.user.username,
          firstName: msg.user.firstName,
          lastName: msg.user.lastName,
          fullName: msg.user.fullName,
          status: 'offline',
        }
        if (msg.user.avatar) {
          user.avatar = msg.user.avatar
        }
        return user
      })

      return { messages, users }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      return { messages: [], users: [] }
    }
  },

  async sendMessage(thread: Thread, text: string): Promise<{ message: Message, user: User }> {
    let response: { data: { message: MessageResponse } }
    
    if (thread.type === 'channel') {
      response = await apiClient.post(`/channels/${thread.id}/messages`, { content: text })
    } else {
      response = await apiClient.post(`/direct-messages/${thread.id}/messages`, { content: text })
    }

    const msg = response.data.message
    const message: Message = {
      id: msg.id,
      senderId: msg.userId,
      text: msg.content,
      createdAt: msg.createdAt,
    }
    
    const user: User = {
      id: msg.user.id,
      username: msg.user.username,
      firstName: msg.user.firstName,
      lastName: msg.user.lastName,
      fullName: msg.user.fullName,
      status: 'offline',
      ...(msg.user.avatar && { avatar: msg.user.avatar }),
    }
    
    return { message, user }
  },

  async deleteMessage(messageId: string, thread: Thread): Promise<void> {
    await apiClient.delete(`/messages/${messageId}`)
  },
}

