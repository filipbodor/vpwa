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

const controller = useChatController()
const messages = computed<{ sender: string; text: string }[]>(() =>
  controller.activeMessages.value.map((m) => ({ sender: m.sender, text: m.text }))
)

function sendMessage(text: string) {
  controller.sendMessage(text)
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


