<!-- src/pages/Chat.vue -->
<template>
  <q-page class="chat-page column">
    <ChatMessage :messages="messages" />
    <ChatInput @send="sendMessage" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChatMessage from 'src/components/chat-container/chat/include/ChatMessage.vue'
import ChatInput from 'src/components/chat-container/chat/include/ChatInput.vue'
import { useChatController } from 'src/modules/chatController'
import { useCommandController } from 'src/modules/commandController'
import { Notify } from 'quasar'

const controller = useChatController()
const commands = useCommandController()
const messages = computed<{ sender: string; text: string }[]>(() =>
  controller.activeMessages.value.map((m) => ({ sender: m.sender, text: m.text }))
)

function sendMessage(text: string) {
  const raw = text.trim()
  if (!raw) return
  if (raw.startsWith('/')) {
    const res = commands.handle(raw)
    if (res.ok) {
      if (res.message) Notify.create({ message: res.message, color: 'positive' })
    } else {
      Notify.create({ message: res.error, color: 'negative' })
    }
    return
  }
  controller.sendMessage(raw)
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


