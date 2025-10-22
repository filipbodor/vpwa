<template>
  <q-page class="chat-page column">
    <ChatMessage :messages="messages" />
    <ChatInput @send="handleSendMessage" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChatMessage from 'src/components/chat-container/chat/include/ChatMessage.vue'
import ChatInput from 'src/components/chat-container/chat/include/ChatInput.vue'
import { useChat, useCommands } from 'src/composables'
import { Notify } from 'quasar'
import { CURRENT_USER_ID } from 'src/services/mock/mockData'

const chat = useChat()
const commands = useCommands()

// Map active messages and include senderId
const messages = computed(() =>
  chat.activeMessages.value.map((m) => ({
    senderId: m.senderId,
    sender: m.senderName,
    text: m.text,
    avatar: m.senderAvatar,
    timestamp: m.createdAt,
  }))
)

async function handleSendMessage(text: string) {
  const raw = text.trim()
  if (!raw) return

  if (raw.startsWith('/')) {
    const res = await commands.handleCommand(raw)
    if (res.success) {
      if (res.message) Notify.create({ message: res.message, color: 'positive' })
    } else {
      Notify.create({ message: res.error || 'Command failed', color: 'negative' })
    }
    return
  }

  try {
    await chat.sendMessage(raw)
  } catch (error) {
    Notify.create({ message: 'Failed to send message', color: 'negative' })
  }
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>