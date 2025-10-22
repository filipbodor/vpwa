import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, Thread } from 'src/models'
import { messageService } from 'src/services/api'

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
      const messages = await messageService.getMessages(thread)
      messagesByThread.value.set(key, messages)
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
      const newMessage = await messageService.sendMessage(thread, text)
      const messages = messagesByThread.value.get(key) || []
      messages.push(newMessage)
      messagesByThread.value.set(key, messages)
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

  async function editMessage(messageId: string, thread: Thread, newText: string) {
    const key = getThreadKey(thread)
    try {
      const updatedMessage = await messageService.editMessage(messageId, thread, newText)
      const messages = messagesByThread.value.get(key)
      if (messages) {
        const index = messages.findIndex(msg => msg.id === messageId)
        if (index !== -1) messages[index] = updatedMessage
      }
      return updatedMessage
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to edit message'
      throw e
    }
  }

  function clearMessages(thread: Thread) {
    const key = getThreadKey(thread)
    messagesByThread.value.delete(key)
  }

  return { messagesByThread, isLoading, error, getMessagesForThread, fetchMessages, sendMessage, deleteMessage, editMessage, clearMessages }
})

