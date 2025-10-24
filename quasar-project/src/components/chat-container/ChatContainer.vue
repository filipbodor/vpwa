<template>
  <q-layout view="lHh Lpr lFf" class="no-overflow">
    <ChatHeader @toggle-drawer="toggleLeftDrawer">
      <template #title>
        <slot name="title">Slack 2.0</slot>
      </template>
    </ChatHeader>

    <Sidebar v-model="leftDrawerOpen" />

    <q-page-container class="no-overflow">
      <Chat />
    </q-page-container>
  </q-layout>

</template>

<script setup>
import ChatHeader from 'src/components/chat-container/header/ChatHeader.vue'
import Sidebar from 'src/components/chat-container/sidebar/Sidebar.vue'
import Chat from 'src/components/chat-container/chat/Chat.vue'
import { ref, onMounted } from 'vue'
import { useChat } from 'src/composables'
import { Notify } from 'quasar'

const leftDrawerOpen = ref(false)
const chat = useChat()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
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


