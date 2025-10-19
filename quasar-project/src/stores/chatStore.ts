import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Thread, DirectMessage } from 'src/models'
import { userService } from 'src/services/api'

export const useChatStore = defineStore('chat', () => {
  const activeThread = ref<Thread | null>(null)
  const directMessages = ref<Map<string, DirectMessage>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const dmList = computed(() => {
    return Array.from(directMessages.value.values()).sort((a, b) => {
      const aTime = a.lastMessageAt || 0
      const bTime = b.lastMessageAt || 0
      return bTime - aTime
    })
  })

  async function fetchDirectMessages() {
    isLoading.value = true
    error.value = null
    try {
      const dms = await userService.getDirectMessages()
      dms.forEach(dm => directMessages.value.set(dm.id, dm))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch direct messages'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createOrGetDM(userId: string): Promise<DirectMessage> {
    try {
      const dm = await userService.createOrGetDM(userId)
      directMessages.value.set(dm.id, dm)
      return dm
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create direct message'
      throw e
    }
  }

  function setActiveThread(thread: Thread | null) {
    activeThread.value = thread
  }

  function openChannel(channelId: string) {
    activeThread.value = { type: 'channel', id: channelId }
  }

  function openDM(dmId: string) {
    activeThread.value = { type: 'dm', id: dmId }
  }

  function closeThread() {
    activeThread.value = null
  }

  function getDMById(dmId: string): DirectMessage | undefined {
    return directMessages.value.get(dmId)
  }

  return {
    activeThread, directMessages, isLoading, error, dmList,
    fetchDirectMessages, createOrGetDM, setActiveThread, openChannel, openDM, closeThread, getDMById
  }
})

