<template>
  <q-layout view="lHh Lpr lFf" class="no-overflow">
    <ChatHeader ref="chatHeaderRef" @toggle-drawer="toggleLeftDrawer">
      <template #title>
        {{ activeTitle }}
      </template>
    </ChatHeader>

    <Sidebar v-model="leftDrawerOpen" />

    <q-page-container class="no-overflow">
      <Chat @open-channel-info="openChannelInfo" />
    </q-page-container>
  </q-layout>
  
</template>

<script setup>
import ChatHeader from 'src/components/chat-container/header/ChatHeader.vue'
import Sidebar from 'src/components/chat-container/sidebar/Sidebar.vue'
import Chat from 'src/components/chat-container/chat/Chat.vue'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useChat, useWebSocket, useAppNotifications } from 'src/composables'
import { Notify } from 'quasar'

const chatHeaderRef = ref(null)

const leftDrawerOpen = ref(false)
const chat = useChat()
const websocket = useWebSocket()
const notifications = useAppNotifications()

const activeTitle = computed(() => {
  const thread = chat.activeThread.value
  if (!thread) return 'Slack 2.0'
  
  if (thread.type === 'channel') {
    const channelInfo = chat.activeChannelInfo.value
    return channelInfo ? channelInfo.name : 'Channel'
  } else {
    const dmInfo = chat.activeDMInfo.value
    return dmInfo ? dmInfo.userName : 'Direct Message'
  }
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function openChannelInfo() {
  if (chatHeaderRef.value?.showChannelInfo) {
    chatHeaderRef.value.showChannelInfo()
  }
}

let previousChannelId = null
watch(() => chat.activeThread.value, (newThread) => {
  if (!websocket.isConnected.value) {
    return
  }

  if (previousChannelId) {
    websocket.unsubscribeFromChannel(previousChannelId)
  }

  if (newThread && newThread.type === 'channel') {
    websocket.subscribeToChannel(newThread.id)
    previousChannelId = newThread.id
  } else {
    previousChannelId = null
  }
})

watch(() => websocket.isConnected.value, (connected) => {
  if (connected) {
    chat.channels.value.forEach(channel => {
      websocket.subscribeToChannel(channel.id)
    })
    
    if (chat.activeThread.value && chat.activeThread.value.type === 'channel') {
      websocket.subscribeToChannel(chat.activeThread.value.id)
      previousChannelId = chat.activeThread.value.id
    }
  }
})

watch(() => chat.userStatus.value, async (newStatus, oldStatus) => {
  if (oldStatus === 'offline' && newStatus !== 'offline') {
    console.log('[ChatContainer] User went online, reconnecting and refreshing...')
    websocket.disconnect()
    await new Promise(resolve => setTimeout(resolve, 500))
    websocket.connect()
    
    await chat.channels.value.forEach(async (channel) => {
      if (chat.activeThread.value?.type === 'channel' && chat.activeThread.value.id === channel.id) {
        const { useMessageStore } = await import('src/stores/pinia-stores')
        await useMessageStore().fetchMessages({ type: 'channel', id: channel.id })
      }
    })
  } else if (newStatus === 'offline' && oldStatus !== 'offline') {
    console.log('[ChatContainer] User went offline, disconnecting...')
    websocket.disconnect()
  }
})

onMounted(async () => {
  try {
    await chat.initialize()
    await notifications.requestNotificationPermission()
    
    if (chat.userStatus.value !== 'offline') {
      websocket.connect()
    }
  } catch (error) {
    console.error('[ChatContainer] Init error:', error)
    Notify.create({ message: 'Failed to initialize chat', color: 'negative' })
  }
})

onUnmounted(() => {
  websocket.disconnect()
})
</script>

<style scoped>
.no-overflow {
  overflow: hidden !important;
  height: 100vh;
}
</style>


