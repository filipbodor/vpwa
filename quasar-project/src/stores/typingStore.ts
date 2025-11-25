import { defineStore } from 'pinia'
import { ref } from 'vue'

interface TypingUser {
  userId: string
  username: string
  timestamp: number
  text: string
}

export const useTypingStore = defineStore('typing', () => {
  const typingByChannel = ref<Map<string, TypingUser[]>>(new Map())

  function setUserTyping(channelId: string, userId: string, username: string, isTyping: boolean, text: string = '') {
    const channelTyping = typingByChannel.value.get(channelId) || []
    
    if (isTyping) {
      const existingIndex = channelTyping.findIndex(t => t.userId === userId)
      if (existingIndex >= 0) {
        const existing = channelTyping[existingIndex]
        if (existing) {
          existing.timestamp = Date.now()
          existing.text = text
        }
      } else {
        channelTyping.push({ userId, username, timestamp: Date.now(), text })
      }
    } else {
      const filtered = channelTyping.filter(t => t.userId !== userId)
      typingByChannel.value.set(channelId, filtered)
      return
    }
    
    typingByChannel.value.set(channelId, [...channelTyping])
  }

  function getTypingUsers(channelId: string): TypingUser[] {
    const now = Date.now()
    const channelTyping = typingByChannel.value.get(channelId) || []
    return channelTyping.filter(t => now - t.timestamp < 5000)
  }

  function clearTyping(channelId: string) {
    typingByChannel.value.delete(channelId)
  }

  return {
    typingByChannel,
    setUserTyping,
    getTypingUsers,
    clearTyping,
  }
})

