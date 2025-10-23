<template>
  <div class="chat-messages scroll q-pa-md" ref="chatContainer">
    <q-infinite-scroll
      :offset="50"
      @load="loadMoreMessages"
      scroll-target="chatContainer"
      reverse
    >
      <div
        v-for="(msg, index) in displayedMessages"
        :key="msg.id || index"
        class="message-wrapper"
        :class="{ 'message-sent': msg.senderId === CURRENT_USER_ID }"
      >
        <div class="message-avatar">
          <q-avatar size="36px" color="primary" text-color="white">
            {{ msg.sender.charAt(0).toUpperCase() }}
          </q-avatar>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">{{ msg.sender }}</span>
            <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
          </div>
          <div
            class="message-bubble"
            :class="{ 'message-bubble-sent': msg.senderId === CURRENT_USER_ID }"
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { CURRENT_USER_ID } from 'src/services/mock/mockData'

const props = defineProps<{
  messages: { id?: string; senderId: string; sender: string; text: string; timestamp?: number }[]
}>()

const chatContainer = ref<HTMLElement | null>(null)
const loading = ref(false)

// How many messages to load per batch
const BATCH_SIZE = 20

// Start with last BATCH_SIZE messages
const displayedMessages = ref(
  props.messages.slice(-BATCH_SIZE)
)

// Prepend older messages as you scroll up
async function loadMoreMessages(index: number, done: (stop?: boolean) => void) {
  if (loading.value) {
    done(true)
    return
  }
  loading.value = true

  // simulate fetching older messages
  await new Promise(r => setTimeout(r, 500))

  const alreadyLoaded = displayedMessages.value.length
  const totalMessages = props.messages.length

  if (alreadyLoaded >= totalMessages) {
    // No more messages
    done(true)
  } else {
    // Get older batch
    const start = Math.max(0, totalMessages - alreadyLoaded - BATCH_SIZE)
    const end = totalMessages - alreadyLoaded
    const olderBatch = props.messages.slice(start, end)
    displayedMessages.value.unshift(...olderBatch)
    done()
  }

  loading.value = false
}

// Scroll to bottom on mount
onMounted(async () => {
  await nextTick()

  // Scroll to bottom when chat first loads
  const container = chatContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }

  // Quasar Infinite Scroll with `reverse`
  // starts from the "top", so we manually trigger a fake scroll
  // to make it realize we're already at the bottom
  await nextTick()
  container?.dispatchEvent(new Event('scroll'))
})

// Format timestamp
function formatTime(ts?: number) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Watch props.messages in case new messages are added at the bottom
const currentChatKey = ref('')

watch(
  () => props.messages,
  async (newMessages, oldMessages) => {
    await nextTick()

    const newKey = JSON.stringify(newMessages.map(m => m.id))
    if (newKey !== currentChatKey.value) {
      // new chat: reset displayed messages
      displayedMessages.value = newMessages.slice(-BATCH_SIZE)
      currentChatKey.value = newKey
    } else {
      // same chat: append new messages
      const newCount = newMessages.length - (oldMessages?.length || 0)
      if (newCount > 0) {
        displayedMessages.value.push(...newMessages.slice(-newCount))
      }
    }

    // Scroll to bottom
    chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight })
  },
  { deep: true }
)
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