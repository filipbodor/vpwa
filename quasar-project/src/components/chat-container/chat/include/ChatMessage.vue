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
        :class="{
          'message-sent': msg.senderId === currentUserId,
          'message-mentioned': isMentioned(msg)
        }"
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
            :class="{
              'message-bubble-sent': msg.senderId === currentUserId,
              'message-bubble-mentioned': isMentioned(msg)
            }"
            v-html="formatMessageText(msg.text)"
          >
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

const props = defineProps<{
  messages: { id?: string; senderId: string; sender: string; text: string; mentions?: string[]; timestamp?: number }[]
  currentUserId: string
}>()

const chatContainer = ref<HTMLElement | null>(null)
const BATCH_SIZE = 20
const loading = ref(false)

// Start with the newest messages at bottom
const displayedMessages = ref(props.messages.slice(-BATCH_SIZE))

async function loadMoreMessages(index: number, done: (stop?: boolean) => void) {
  if (loading.value) {
    done(true)
    return
  }
  loading.value = true

  const alreadyLoaded = displayedMessages.value.length
  const totalMessages = props.messages.length

  if (alreadyLoaded >= totalMessages) {
    done(true)
    loading.value = false
    return
  }

  // Simulate network delay
  await new Promise(r => setTimeout(r, 300))

  const start = Math.max(0, totalMessages - alreadyLoaded - BATCH_SIZE)
  const end = totalMessages - alreadyLoaded
  const olderBatch = props.messages.slice(start, end)

  const container = chatContainer.value
  const scrollBefore = container?.scrollHeight || 0

  displayedMessages.value = [...olderBatch, ...displayedMessages.value]

  await nextTick()
  const scrollAfter = container?.scrollHeight || 0

  // Maintain scroll position after prepending
  if (container) container.scrollTop += scrollAfter - scrollBefore

  done()
  loading.value = false
}

// Scroll to bottom
async function scrollToBottom() {
  await nextTick()
  const container = chatContainer.value
  if (container) container.scrollTop = container.scrollHeight
}

// Format timestamp
function formatTime(ts?: number) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function isMentioned(msg: { mentions?: string[] }) {
  return msg.mentions?.includes(props.currentUserId) || false
}

function formatMessageText(text: string) {
  const mentionPattern = /@(\w+)/g
  return text.replace(mentionPattern, '<span class="mention">@$1</span>')
}


const currentChatKey = ref('')
watch(
  () => props.messages,
  async (newMessages, oldMessages) => {
    const newKey = JSON.stringify(newMessages.map(m => m.id))
    if (newKey !== currentChatKey.value) {
      displayedMessages.value = newMessages.slice(-BATCH_SIZE)
      currentChatKey.value = newKey
      await scrollToBottom()
    } else {
      const newCount = newMessages.length - (oldMessages?.length || 0)
      if (newCount > 0) {
        displayedMessages.value.push(...newMessages.slice(-newCount))
        await scrollToBottom()
      }
    }
  },
  { deep: true }
)

onMounted(async () => {
  const container = chatContainer.value
  if (!container) return

  // Start with last BATCH_SIZE messages
  displayedMessages.value = props.messages.slice(-BATCH_SIZE)
  await nextTick()

  // Fill container until it scrolls
  const tryLoadOlder = async () => {
    if (container.scrollHeight > container.clientHeight || displayedMessages.value.length >= props.messages.length) {
      // container filled or all messages loaded
      container.scrollTop = container.scrollHeight
      return
    }

    await loadMoreMessages(0, () => {})
    await nextTick()
    await tryLoadOlder()
  }

  tryLoadOlder()
})
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 20px;
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
.message-bubble-mentioned {
  background: #fff8e1 !important;
  color: #1d1c1d;
}
</style>

<style>
.mention {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
}
.mention:hover {
  background: #bbdefb;
}
</style>