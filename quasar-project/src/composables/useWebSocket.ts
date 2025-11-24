import { ref, onUnmounted } from 'vue'
import { useAuthStore, useMessageStore, useUserStore } from 'src/stores/pinia-stores'
import { useAppNotifications } from './useAppNotifications'
import type { Message } from 'src/models'

const API_URL = 'http://localhost:3333'

export function useWebSocket() {
  const eventSource = ref<EventSource | null>(null)
  const isConnected = ref(false)
  const authStore = useAuthStore()
  const messageStore = useMessageStore()
  const userStore = useUserStore()
  const notifications = useAppNotifications()

  const subscribedChannels = ref<Set<string>>(new Set())

  function connect() {
    if (eventSource.value && eventSource.value.readyState === EventSource.OPEN) {
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.warn('[WebSocket] No auth token')
      return
    }

    console.log('[WebSocket] Connecting...')

    try {
      const url = `${API_URL}/__transmit/events?uid=${encodeURIComponent(token)}`
      eventSource.value = new EventSource(url)

      eventSource.value.onopen = () => {
        console.log('[WebSocket] ✅ Connected')
        isConnected.value = true
        
        if (authStore.currentUserId) {
          subscribeToChannel(`users/${authStore.currentUserId}`)
        }
        subscribeToChannel('global')
      }

      eventSource.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleIncomingMessage(data)
        } catch (error) {
          console.error('[WebSocket] Parse error:', error)
        }
      }

      eventSource.value.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error)
        isConnected.value = false
        if (eventSource.value) {
          eventSource.value.close()
        }
      }
    } catch (error) {
      console.error('[WebSocket] Init error:', error)
      isConnected.value = false
    }
  }

  async function subscribeToChannel(channelIdOrName: string) {
    const channelName = channelIdOrName.startsWith('channels/') 
      ? channelIdOrName 
      : channelIdOrName.startsWith('users/') || channelIdOrName === 'global'
        ? channelIdOrName
        : `channels/${channelIdOrName}`
    
    if (subscribedChannels.value.has(channelName)) {
      return
    }
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`${API_URL}/__transmit/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          channel: channelName,
          uid: token
        }),
      })

      if (response.ok) {
        subscribedChannels.value.add(channelName)
        console.log('[WebSocket] Subscribed to', channelName)
      } else {
        console.error('[WebSocket] Subscribe failed:', response.status)
      }
    } catch (error) {
      console.error('[WebSocket] Subscribe error:', error)
    }
  }

  async function unsubscribeFromChannel(channelIdOrName: string) {
    const channelName = channelIdOrName.startsWith('channels/') 
      ? channelIdOrName 
      : channelIdOrName.startsWith('users/') || channelIdOrName === 'global'
        ? channelIdOrName
        : `channels/${channelIdOrName}`
    
    if (!subscribedChannels.value.has(channelName)) {
      return
    }
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`${API_URL}/__transmit/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          channel: channelName,
          uid: token
        }),
      })

      if (response.ok) {
        subscribedChannels.value.delete(channelName)
      }
    } catch (error) {
      console.error('[WebSocket] Unsubscribe error:', error)
    }
  }

  function handleIncomingMessage(data: any) {
    const { channel, payload } = data

    if (channel === '$$transmit/ping' || !payload || !payload.type) {
      return
    }

    switch (payload.type) {
      case 'channel_message':
        handleChannelMessage(payload)
        break
      case 'direct_message':
        handleDirectMessage(payload)
        break
      case 'status_change':
        handleStatusChange(payload)
        break
      case 'typing':
        handleTypingIndicator(payload)
        break
      case 'notification':
        handleNotification(payload)
        break
      default:
        console.warn('[WebSocket] Unknown message type:', payload.type)
    }
  }

  function handleChannelMessage(data: any) {
    const { channelId, message } = data

    if (message.sender) {
      userStore.addUser(message.sender)
    }

    const localMessage: Message = {
      id: message.id,
      senderId: message.senderId,
      text: message.content,
      createdAt: message.createdAt,
      mentions: message.mentions || [],
    }

    const thread = { type: 'channel' as const, id: channelId }
    const currentMessages = messageStore.getMessagesForThread(thread).value
    
    if (!currentMessages.find(m => m.id === localMessage.id)) {
      messageStore.messagesByThread.set(`channel:${channelId}`, [...currentMessages, localMessage])
    }
    
    if (message.senderId !== authStore.currentUserId) {
      notifications.showNotification(
        message.sender.fullName,
        message.content,
        message.sender.avatar
      )
    }
  }

  function handleDirectMessage(data: any) {
    const { directMessageId, message } = data

    if (message.sender) {
      userStore.addUser(message.sender)
    }

    const localMessage: Message = {
      id: message.id,
      senderId: message.senderId,
      text: message.content,
      createdAt: message.createdAt,
      mentions: message.mentions || [],
    }

    const thread = { type: 'dm' as const, id: directMessageId }
    const currentMessages = messageStore.getMessagesForThread(thread).value
    
    if (!currentMessages.find(m => m.id === localMessage.id)) {
      messageStore.messagesByThread.set(`dm:${directMessageId}`, [...currentMessages, localMessage])
    }
    
    if (message.senderId !== authStore.currentUserId) {
      notifications.showNotification(
        message.sender.fullName,
        message.content,
        message.sender.avatar
      )
    }
  }

  function handleStatusChange(data: any) {
    const { userId, status } = data
    const user = userStore.getUserById(userId)
    if (user) {
      user.status = status
    }
  }

  function handleTypingIndicator(data: any) {
    // TODO: Implement typing indicator UI
  }

  function handleNotification(data: any) {
    const { title, body, avatar } = data
    notifications.showNotification(title, body, avatar)
  }

  function disconnect() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    
    subscribedChannels.value.clear()
    isConnected.value = false
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connect,
    disconnect,
    subscribeToChannel,
    unsubscribeFromChannel,
  }
}
