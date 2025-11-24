import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, Thread } from 'src/models'
import { messageService } from 'src/services/api'
import { useUserStore } from './userStore'

export const useMessageStore = defineStore('messages', () => {
  const messagesByThread = ref<Map<string, Message[]>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getThreadKey = (thread: Thread): string => `${thread.type}:${thread.id}`

  const getMessagesForThread = (thread: Thread) => {
    return computed(() => {
      const key = getThreadKey(thread)
      return messagesByThread.value.get(key) || []
    })
  }

  async function fetchMessages(thread: Thread) {
    const key = getThreadKey(thread)
    isLoading.value = true
    error.value = null
    try {
      const { messages, users } = await messageService.getMessages(thread)
      messagesByThread.value.set(key, messages)
      
      // Add users to userStore
      const userStore = useUserStore()
      userStore.addUsers(users)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch messages'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(thread: Thread, text: string) {
    const key = getThreadKey(thread)
    isLoading.value = true
    error.value = null
    try {
      const { message: newMessage, user } = await messageService.sendMessage(thread, text)
      
      // Add the user to userStore
      const userStore = useUserStore()
      userStore.addUser(user)
      
      // Add message optimistically to local store
      // (it will also come via WebSocket but that's OK - we filter duplicates)
      const currentMessages = messagesByThread.value.get(key) || []
      const localMessage = {
        id: newMessage.id,
        senderId: newMessage.senderId,
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        mentions: newMessage.mentions || [],
      }
      
      // Only add if not already present
      if (!currentMessages.find(m => m.id === localMessage.id)) {
        messagesByThread.value.set(key, [...currentMessages, localMessage])
      }
      
      return newMessage
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send message'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteMessage(messageId: string, thread: Thread) {
    const key = getThreadKey(thread)
    try {
      await messageService.deleteMessage(messageId, thread)
      const messages = messagesByThread.value.get(key)
      if (messages) {
        messagesByThread.value.set(key, messages.filter(msg => msg.id !== messageId))
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete message'
      throw e
    }
  }

  function clearMessages(thread: Thread) {
    const key = getThreadKey(thread)
    messagesByThread.value.delete(key)
  }

  function clearAllMessages() {
    messagesByThread.value.clear()
  }

  return { messagesByThread, isLoading, error, getMessagesForThread, fetchMessages, sendMessage, deleteMessage, clearMessages, clearAllMessages }
})

