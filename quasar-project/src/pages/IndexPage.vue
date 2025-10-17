<template>
  <q-page class="chat-page column">
    <!-- Chat messages container -->
    <div class="chat-container" ref="chatContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-message', msg.sender === 'me' ? 'me' : 'other']"
      >
        <q-card flat class="q-pa-sm" :class="msg.sender === 'me' ? 'me-card' : 'other-card'">
          {{ msg.text }}
        </q-card>
      </div>
    </div>

    <!-- Footer input -->
    <div class="chat-footer q-pa-sm row items-center">
      <q-input
        rounded
        outlined
        v-model="text"
        placeholder="Type a message..."
        class="col"
        @keyup.enter="sendMessage"
      />
      <q-btn icon="send" flat round @click="sendMessage" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import messagesData from 'src/assets/messages.json';

const text = ref('');
const messages = ref<{ sender: string; text: string }[]>([]);
const chatContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  const repeatTimes = 200;
  const repeatedMessages: { sender: string; text: string }[] = [];
  for (let i = 0; i < repeatTimes; i++) {
    repeatedMessages.push(...messagesData);
  }
  messages.value = repeatedMessages;
  await nextTick();
  scrollToBottom();
});

function sendMessage() {
  if (!text.value.trim()) return;
  messages.value.push({ sender: 'Me', text: text.value });
  text.value = '';
  nextTick(() => scrollToBottom());
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* prevent extra scroll */
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

/* Message alignment */
.chat-message {
  display: flex;
  max-width: 60%;
}

.chat-message.me {
  align-self: flex-end;
}

.chat-message.other {
  align-self: flex-start;
}

/* Card colors */
.me-card {
  background-color: #1e88e5;
  color: white;
}

.other-card {
  background-color: #e0e0e0;
  color: black;
}

/* Footer styling */
.chat-footer {
  flex-shrink: 0;
  background-color: white;
}
</style>
