import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Thread } from 'src/models'

export const useChatStore = defineStore('chat', () => {
  const activeThread = ref<Thread | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function setActiveThread(thread: Thread | null) {
    activeThread.value = thread
  }

  function openChannel(channelId: string) {
    activeThread.value = { type: 'channel', id: channelId }
  }

  function closeThread() {
    activeThread.value = null
  }

  return {
    activeThread, isLoading, error,
    setActiveThread, openChannel, closeThread
  }
})

