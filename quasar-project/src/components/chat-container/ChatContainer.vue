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
import { ref, onMounted, computed } from 'vue'
import { useChat } from 'src/composables'
import { Notify } from 'quasar'

const chatHeaderRef = ref(null)

const leftDrawerOpen = ref(false)
const chat = useChat()

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

onMounted(async () => {
  console.log('Initializing chat...')
  try {
    await chat.initialize()
    console.log('Chat initialized successfully')
  } catch (error) {
    console.error('Failed to initialize chat:', error)
    Notify.create({ message: 'Failed to initialize chat', color: 'negative' })
  }
})
</script>

<style scoped>
.no-overflow {
  overflow: hidden !important;
  height: 100vh;
}
</style>


