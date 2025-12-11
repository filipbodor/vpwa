<template>
  <q-scroll-area class="chat-messages" ref="scrollArea">
    <div class="q-pa-md">
      <q-infinite-scroll
        :key="currentChatKey"
        :offset="50"
        @load="loadMoreMessages"
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
    {{ msg.avatar || msg.sender.charAt(0).toUpperCase() }}
  </q-avatar>
  <span
    class="status-dot"
    :class="getStatusColor(msg.status)"
    title="User status"
  ></span>
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
  </q-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, reactive } from 'vue'
import { QScrollArea } from 'quasar'
import type { User, UserStatus } from 'src/models'






const props = defineProps<{
  messages: {
    id?: string
    senderId: string
    sender: string
    avatar?: string | null   // <-- add this
    text: string
    mentions?: string[]
    timestamp?: number
    status?: UserStatus;
  }[]
  currentUserId: string
}>()



const messagesReactive = reactive([...props.messages])

function getStatusColor(status?: UserStatus): string {
  const colors: Record<UserStatus, string> = {
    online: 'positive',
    dnd: 'negative',
    offline: 'grey',
  }
  return status ? colors[status] : colors.offline
}

const scrollArea = ref<QScrollArea | null>(null)
const BATCH_SIZE = 20
const loading = ref(false)

// Start with the newest messages at bottom
const displayedMessages = ref(props.messages.slice(-BATCH_SIZE))
function onAvatarError(msg: typeof props.messages[number]) {
  msg.avatar = null
}
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

  const start = Math.max(0, totalMessages - alreadyLoaded - BATCH_SIZE)
  const end = totalMessages - alreadyLoaded
  const olderBatch = props.messages.slice(start, end)

  if (olderBatch.length === 0) {
    done(true)
    loading.value = false
    return
  }

  const scrollTarget = scrollArea.value?.getScrollTarget()
  if (!scrollTarget) {
    done(true)
    loading.value = false
    return
  }

  const scrollHeightBefore = scrollTarget.scrollHeight
  const scrollTopBefore = scrollTarget.scrollTop

  displayedMessages.value = [...olderBatch, ...displayedMessages.value]

  await nextTick()
  
  if (scrollArea.value) {
    const scrollHeightAfter = scrollTarget.scrollHeight
    const addedHeight = scrollHeightAfter - scrollHeightBefore
    const newScrollTop = scrollTopBefore + addedHeight
    
    scrollArea.value.setScrollPosition('vertical', newScrollTop, 0)
  }

  await nextTick()
  
  const hasMore = displayedMessages.value.length < totalMessages
  done(!hasMore)
  loading.value = false
}

// Scroll to bottom
async function scrollToBottom() {
  await nextTick()
  if (scrollArea.value) {
    const scrollTarget = scrollArea.value.getScrollTarget()
    scrollArea.value.setScrollPosition('vertical', scrollTarget.scrollHeight, 300)
  }
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
const isInitialLoad = ref(true)
const shouldScrollToBottom = ref(false)

function isNearBottom(): boolean {
  if (!scrollArea.value) return true
  const scrollTarget = scrollArea.value.getScrollTarget()
  const scrollHeight = scrollTarget.scrollHeight
  const scrollTop = scrollTarget.scrollTop
  const clientHeight = scrollTarget.clientHeight
  const threshold = 150
  return scrollHeight - scrollTop - clientHeight < threshold
}

watch(
  () => props.messages,
  async (newMessages, oldMessages) => {
    if (!newMessages || newMessages.length === 0) {
      displayedMessages.value = []
      return
    }

    const firstMsgId = newMessages[0]?.id || ''
    const lastMsgId = newMessages[newMessages.length - 1]?.id || ''
    const newKey = `${firstMsgId}-${lastMsgId}-${newMessages.length}`
    
    const isSwitchingChat = oldMessages && oldMessages.length > 0 && 
                            oldMessages[0]?.id !== firstMsgId

    if (isSwitchingChat) {
      loading.value = false
      displayedMessages.value = newMessages.slice(-BATCH_SIZE)
      currentChatKey.value = newKey
      isInitialLoad.value = false
      shouldScrollToBottom.value = true
      await nextTick()
      await scrollToBottom()
    } else if (isInitialLoad.value) {
      displayedMessages.value = newMessages.slice(-BATCH_SIZE)
      currentChatKey.value = newKey
      isInitialLoad.value = false
      shouldScrollToBottom.value = false
    } else {
      const newCount = newMessages.length - (oldMessages?.length || 0)
      if (newCount > 0) {
        const wasNearBottom = isNearBottom()
        displayedMessages.value.push(...newMessages.slice(-newCount))
        if (wasNearBottom) {
          await nextTick()
          await scrollToBottom()
        }
      }
    }
  },
  { deep: true }
)

onMounted(async () => {
  
  if (!scrollArea.value) return

  if (displayedMessages.value.length === 0) {
    displayedMessages.value = props.messages.slice(-BATCH_SIZE)
  }
  
  await nextTick()
  await nextTick()

  const scrollTarget = scrollArea.value.getScrollTarget()
  
  const tryLoadOlder = async () => {
    if (scrollTarget.scrollHeight > scrollTarget.clientHeight || displayedMessages.value.length >= props.messages.length) {
      if (shouldScrollToBottom.value || isInitialLoad.value) {
        await scrollToBottom()
      }
      isInitialLoad.value = false
      shouldScrollToBottom.value = false
      return
    }

    await loadMoreMessages(0, () => {})
    await nextTick()
    await tryLoadOlder()
  }

  await tryLoadOlder()
})
</script>

<style scoped>
.chat-messages {
  flex: 1;
  height: 100%;
  background-color: #ffffff;
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
.message-avatar {
  position: relative; /* positioning context for dot */
  display: inline-block;
}

.status-dot {
  position: absolute;
  bottom: 0;    /* adjust so dot overlaps outside */
  right: 0;     /* adjust so dot overlaps outside */
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: green; /* temporary for testing */
  box-sizing: border-box;
  z-index: 10; /* make sure it’s on top */
}
</style>