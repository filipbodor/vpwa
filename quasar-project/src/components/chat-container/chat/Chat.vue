<template>
  <q-page class="chat-page column">
    <ChatMessage :messages="messages" :current-user-id="chat.currentUserId.value" />
    <TypingIndicator v-if="activeChannelId" :channel-id="activeChannelId" />
    <ChatInput v-if="activeChannelId" :channel-id="activeChannelId" @send="handleSendMessage" />
    <ChatInput v-else @send="handleSendMessage" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChatMessage from 'src/components/chat-container/chat/include/ChatMessage.vue'
import ChatInput from 'src/components/chat-container/chat/include/ChatInput.vue'
import TypingIndicator from 'src/components/chat-container/chat/include/TypingIndicator.vue'
import { useChat, useCommands } from 'src/composables'
import { Notify } from 'quasar'

const emit = defineEmits<{
  (e: 'open-channel-info'): void
}>()

const chat = useChat()
const commands = useCommands()

const activeChannelId = computed(() => {
  const thread = chat.activeThread.value
  return thread?.type === 'channel' ? thread.id : undefined
})

// computed messages include senderId, timestamp, etc.
const messages = computed(() =>
  chat.activeMessages.value.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    sender: m.senderName,
    avatar: m.senderAvatar || null, 
    text: m.text,
    mentions: m.mentions || [],
    timestamp: m.createdAt,
  }))
)

async function handleSendMessage(text: string) {
  const raw = text.trim()
  if (!raw) return

  // Command handling
  if (raw.startsWith('/')) {
    const res = await commands.handleCommand(raw)
    if (res.success) {

      if (res.message === 'list_members') {
        emit('open-channel-info')
      } else if (res.message) {
        Notify.create({ message: res.message, color: 'positive' })
      }
    } else {
      Notify.create({ message: res.error || 'Command failed', color: 'negative' })
    }
    return
  }

  // Send message only once
  try {
    await chat.sendMessage(raw)
  } catch {
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