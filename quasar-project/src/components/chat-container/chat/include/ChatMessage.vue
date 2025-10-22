<template>
  <div class="chat-messages scroll" ref="chatContainer">
    <div class="messages-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-wrapper"
        :class="{ 'message-sent': msg.sender === 'me' }"
      >
        <div class="message-avatar" v-if="msg.sender !== 'me'">
          <q-avatar size="36px" color="primary" text-color="white">
            {{ msg.sender.charAt(0).toUpperCase() }}
          </q-avatar>
        </div>
        <div class="message-content">
          <div class="message-header" v-if="msg.sender !== 'me'">
            <span class="message-sender">{{ msg.sender }}</span>
            <span class="message-time">{{ formatTime(new Date()) }}</span>
          </div>
          <div class="message-bubble" :class="{ 'message-bubble-sent': msg.sender === 'me' }">
            {{ msg.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'

const props = defineProps<{
  messages: { sender: string; text: string }[]
}>()

const chatContainer = ref<HTMLElement | null>(null)

// Scroll whenever messages change
watch(
  () => props.messages,
  async () => {
    await nextTick()
    scrollToBottom()
  },
  { deep: true }
)

// Initial scroll after component mounted
onMounted(async () => {
  await nextTick()
  scrollToBottom()
})

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 20px;
}

.messages-container {
  max-width: 100%;
}

.message-wrapper {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
  align-items: flex-start;
}

.message-wrapper.message-sent {
  flex-direction: row-reverse;
  align-items: flex-end;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 65%;
}

.message-sent .message-content {
  align-items: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  padding: 0 12px;
}

.message-sender {
  font-weight: 700;
  font-size: 15px;
  color: #1d1c1d;
}

.message-time {
  font-size: 12px;
  color: #616061;
}

.message-bubble {
  background: #f1f0f1;
  padding: 10px 14px;
  border-radius: 8px;
  color: #1d1c1d;
  font-size: 15px;
  line-height: 1.46668;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: background 0.15s ease;
}

.message-bubble:hover {
  background: #e8e7e8;
}

.message-bubble-sent {
  background: #611f69;
  color: white;
}

.message-bubble-sent:hover {
  background: #4a154b;
}
</style>