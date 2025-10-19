<!-- src/pages/Chat.vue -->
<template>
  <q-page class="chat-page column">
    <ChatMessage :messages="messages" />
    <ChatInput @send="sendMessage" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatMessage from 'src/components/chat-container/chat/include/ChatMessage.vue'
import ChatInput from 'src/components/chat-container/chat/include/ChatInput.vue'
import messagesData from 'src/assets/messages.json'

const messages = ref<{ sender: string; text: string }[]>([])

onMounted(() => {
  const repeatTimes = 200
  const repeatedMessages: { sender: string; text: string }[] = []
  for (let i = 0; i < repeatTimes; i++) {
    repeatedMessages.push(...messagesData)
  }
  messages.value = repeatedMessages
})

function sendMessage(text: string) {
  messages.value.push({ sender: 'me', text })
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


