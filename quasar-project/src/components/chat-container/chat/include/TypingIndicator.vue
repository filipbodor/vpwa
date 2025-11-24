<template>
  <div v-if="typingUsers.length > 0" class="typing-indicator">
    <div class="typing-text">
      <q-spinner-dots color="grey-7" size="20px" />
      <span class="typing-message">
        <template v-if="typingUsers.length === 1">
          <span class="username-link" @click="showPreview(typingUsers[0])">
            {{ typingUsers[0]?.username }}
          </span>
          is typing...
        </template>
        <template v-else-if="typingUsers.length === 2 && typingUsers[1]">
          <span class="username-link" @click="showPreview(typingUsers[0])">
            {{ typingUsers[0]?.username }}
          </span>
          and
          <span class="username-link" @click="showPreview(typingUsers[1])">
            {{ typingUsers[1].username }}
          </span>
          are typing...
        </template>
        <template v-else>
          <span class="username-link" @click="showPreview(typingUsers[0])">
            {{ typingUsers[0]?.username }}
          </span>
          and {{ typingUsers.length - 1 }} others are typing...
        </template>
      </span>
    </div>
    
    <q-dialog v-model="previewDialog">
      <q-card style="min-width: 400px; max-width: 600px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedUser?.username }} is typing...</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section>
          <div class="preview-text">
            {{ selectedUser?.text || '...' }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useTypingStore } from 'src/stores/pinia-stores'

interface TypingUser {
  userId: string
  username: string
  timestamp: number
  text: string
}

const props = defineProps<{
  channelId?: string
}>()

const typingStore = useTypingStore()
const previewDialog = ref(false)
const selectedUserId = ref<string | null>(null)

let interval: NodeJS.Timeout | null = null

const typingUsers = computed(() => {
  if (!props.channelId) return []
  return typingStore.getTypingUsers(props.channelId)
})

const selectedUser = computed(() => {
  if (!selectedUserId.value || !props.channelId) return null
  const users = typingStore.getTypingUsers(props.channelId)
  return users.find(u => u.userId === selectedUserId.value) || null
})

function showPreview(user: TypingUser | undefined) {
  if (!user) return
  selectedUserId.value = user.userId
  previewDialog.value = true
}

onMounted(() => {
  interval = setInterval(() => {
    if (props.channelId) {
      typingStore.getTypingUsers(props.channelId)
    }
  }, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.typing-indicator {
  padding: 4px 20px 0 20px;
  background: white;
  min-height: 24px;
  display: flex;
  align-items: center;
}

.typing-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #616061;
}

.typing-message {
  font-style: italic;
}

.username-link {
  color: #1264a3;
  cursor: pointer;
  font-weight: 600;
  font-style: normal;
  transition: all 0.2s ease;
}

.username-link:hover {
  color: #0b4c8c;
  text-decoration: underline;
}

.preview-text {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100px;
  white-space: pre-wrap;
  word-break: break-word;
  color: #1d1c1d;
}
</style>

