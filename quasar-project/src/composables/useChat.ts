import { computed } from 'vue'
import { useAuthStore, useChannelStore, useChatStore, useMessageStore, useUserStore } from 'src/stores/pinia-stores'

export function useChat() {
  const authStore = useAuthStore()
  const channelStore = useChannelStore()
  const chatStore = useChatStore()
  const messageStore = useMessageStore()
  const userStore = useUserStore()

  const currentUser = computed(() => authStore.currentUser)
  const currentUserId = computed(() => authStore.currentUserId)
  const userStatus = computed(() => authStore.userStatus)
  const activeThread = computed(() => chatStore.activeThread)
  
  const channels = computed(() => {
    return channelStore.channelList.map(channel => ({
      ...channel,
      isOwner: channel.ownerId === currentUserId.value,
    }))
  })

  const activeMessages = computed(() => {
    if (!activeThread.value) return []
    const messages = messageStore.getMessagesForThread(activeThread.value).value
    return messages.map(msg => {
      const sender = userStore.getUserById(msg.senderId)
      return {
        ...msg,
        senderName: sender?.fullName || 'Unknown',
        senderAvatar: sender?.avatar,
        isCurrentUser: msg.senderId === currentUserId.value,
      }
    })
  })

  const activeChannelInfo = computed(() => {
    if (!activeThread.value || activeThread.value.type !== 'channel') return null
    const channel = channelStore.getChannelById(activeThread.value.id)
    if (!channel) return null
    return {
      ...channel,
      isOwner: channel.ownerId === currentUserId.value,
      memberCount: channel.memberIds.length,
    }
  })

  async function initialize() {
    try {
      if (!authStore.currentUser) {
        await authStore.fetchCurrentUser()
      }
      
      await Promise.all([
        channelStore.fetchMyChannels(),
        userStore.fetchAllUsers(),
      ])
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      throw error
    }
  }

  async function openChannel(channelId: string) {
    chatStore.openChannel(channelId)
    await messageStore.fetchMessages({ type: 'channel', id: channelId })
  }

  async function sendMessage(text: string) {
    if (!activeThread.value || !text.trim()) return
    try {
      await messageStore.sendMessage(activeThread.value, text.trim())
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  async function createChannel(data: { name: string; description?: string; isPrivate: boolean }) {
    try {
      const newChannel = await channelStore.createChannel(data)
      await openChannel(newChannel.id)
      return newChannel
    } catch (error) {
      console.error('Failed to create channel:', error)
      throw error
    }
  }

  async function leaveChannel(channelId: string) {
    try {
      await channelStore.leaveChannel(channelId)
      if (activeThread.value?.type === 'channel' && activeThread.value.id === channelId) {
        chatStore.closeThread()
      }
    } catch (error) {
      console.error('Failed to leave channel:', error)
      throw error
    }
  }

  async function deleteChannel(channelId: string) {
    try {
      await channelStore.deleteChannel(channelId)
      if (activeThread.value?.type === 'channel' && activeThread.value.id === channelId) {
        chatStore.closeThread()
      }
    } catch (error) {
      console.error('Failed to delete channel:', error)
      throw error
    }
  }

  async function updateStatus(status: 'online' | 'dnd' | 'offline') {
    try {
      await authStore.updateUserStatus(status)
    } catch (error) {
      console.error('Failed to update status:', error)
      throw error
    }
  }

  function findChannelByName(name: string) {
    return channelStore.findChannelByName(name)
  }

  function findUserByName(name: string) {
    return userStore.findUserByName(name)
  }

  async function inviteToChannel(channelId: string, userId: string) {
    try {
      await channelStore.inviteUser(channelId, userId)
    } catch (error) {
      console.error('Failed to invite user:', error)
      throw error
    }
  }

  async function removeFromChannel(channelId: string, userId: string) {
    try {
      await channelStore.removeUser(channelId, userId)
    } catch (error) {
      console.error('Failed to remove user:', error)
      throw error
    }
  }

  async function clearChannelInvite(channelId: string) {
    try {
      await channelStore.clearInviteFlag(channelId)
    } catch (error) {
      console.error('Failed to clear invite flag:', error)
      throw error
    }
  }

  return {
    currentUser, currentUserId, userStatus, activeThread, channels,
    activeMessages, activeChannelInfo, initialize, openChannel,
    sendMessage, createChannel, leaveChannel, deleteChannel, updateStatus,
    findChannelByName, findUserByName, inviteToChannel, removeFromChannel, clearChannelInvite
  }
}

