<template>
  <q-page class="chat-page column">
    <!-- Chat messages -->
    <div class="chat-messages scroll" ref="chatContainer">
      <q-chat-message
        v-for="(msg, index) in messages"
        :key="index"
        :text="[msg.text]"
        :sent="msg.sender === 'me'"
        :bg-color="msg.sender === 'me' ? 'blue-8' : 'grey-3'"
      />
      <q-chat-message name="Jane" bg-color="grey-3">
        <q-spinner-dots size="2rem" />
      </q-chat-message>
    </div>

    <!-- Compact footer -->
    <div class="chat-footer row items-center">
      <q-input
        class="col rounded-input"
        outlined
        rounded
        v-model="text"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />
      <q-btn icon="send" round flat dense @click="sendMessage" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import messagesData from 'src/assets/messages.json'

const text = ref('')
const messages = ref<{ sender: string; text: string }[]>([])
const chatContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  const repeatTimes = 200
  const repeatedMessages: { sender: string; text: string }[] = []

  for (let i = 0; i < repeatTimes; i++) {
    repeatedMessages.push(...messagesData)
  }

  messages.value = repeatedMessages
  await nextTick()
  scrollToBottom()
})

function sendMessage() {
  if (!text.value.trim()) return
  messages.value.push({ sender: 'me', text: text.value })
  text.value = ''
  nextTick(() => scrollToBottom())
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
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

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 8px;
}

.chat-footer {
  display: flex;
  align-items: center;
  padding: 4px 8px; /* reduce padding to remove unused white space */
  background-color: #f5f5f5;;
}

.rounded-input .q-field__control {
  padding-top: 4px; /* reduce vertical padding inside input */
  padding-bottom: 4px;
}
</style>