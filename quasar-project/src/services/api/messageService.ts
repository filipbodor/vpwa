import type { Message, Thread } from 'src/models'
import { mockMessages, CURRENT_USER_ID } from '../mock/mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getThreadKey = (thread: Thread): string => `${thread.type}:${thread.id}`

export const messageService = {
  async getMessages(thread: Thread): Promise<Message[]> {
    await delay(100)
    const key = getThreadKey(thread)
    return mockMessages[key] || []
  },

  async sendMessage(thread: Thread, text: string): Promise<Message> {
    await delay(150)
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      senderId: CURRENT_USER_ID,
      text,
      createdAt: Date.now(),
    }
    const key = getThreadKey(thread)
    if (!mockMessages[key]) mockMessages[key] = []
    mockMessages[key].push(newMessage)
    return newMessage
  },

  async deleteMessage(messageId: string, thread: Thread): Promise<void> {
    await delay(100)
    const key = getThreadKey(thread)
    if (mockMessages[key]) {
      mockMessages[key] = mockMessages[key].filter(msg => msg.id !== messageId)
    }
  },

  async editMessage(messageId: string, thread: Thread, newText: string): Promise<Message> {
    await delay(100)
    const key = getThreadKey(thread)
    const message = mockMessages[key]?.find(msg => msg.id === messageId)
    if (message) {
      message.text = newText
      message.updatedAt = Date.now()
      return message
    }
    throw new Error('Message not found')
  },
}

