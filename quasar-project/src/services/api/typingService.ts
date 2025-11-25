import { apiClient } from './apiClient'

export const typingService = {
  async sendTyping(channelId: string, isTyping: boolean, text?: string): Promise<void> {
    await apiClient.post('/typing', { channelId, isTyping, text })
  },
}

