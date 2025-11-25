<template>
  <div class="chat-footer">
    <div class="chat-input-wrapper">
      <q-input
        v-model="text"
        class="chat-input"
        outlined
        dense
        placeholder="Message..."
        bg-color="white"
        @keyup.enter="handleSend"
        @update:model-value="handleInput"
      >
        <template v-slot:prepend>
          <q-btn flat dense round size="sm" icon="add_circle_outline" color="grey-7" class="q-mr-xs" />
        </template>
        <template v-slot:append>
          <q-btn flat dense round size="sm" icon="sentiment_satisfied_alt" color="grey-7" class="q-mr-xs" />
          <q-btn flat dense round size="sm" icon="alternate_email" color="grey-7" class="q-mr-xs" />
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="send"
            color="primary"
            @click="handleSend"
            :disable="!text.trim()"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { typingService } from 'src/services/api'

const props = defineProps<{
  channelId?: string
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const text = ref('')
let typingTimeout: NodeJS.Timeout | null = null
let isTyping = false

async function sendTypingStatus(typing: boolean) {
  if (!props.channelId) return
  
  try {
    await typingService.sendTyping(props.channelId, typing, typing ? text.value : '')
    isTyping = typing
  } catch (error) {
    console.error('[ChatInput] Failed to send typing status:', error)
  }
}

function handleInput() {
  if (!props.channelId) return
  
  if (!isTyping) {
    sendTypingStatus(true)
  }
  
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  
  typingTimeout = setTimeout(() => {
    sendTypingStatus(false)
  }, 3000)
}

watch(text, (newValue, oldValue) => {
  if (!props.channelId) return
  if (newValue === oldValue) return
  
  if (newValue.length > 0) {
    sendTypingStatus(true)
    
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    
    typingTimeout = setTimeout(() => {
      sendTypingStatus(false)
    }, 3000)
  } else if (isTyping) {
    sendTypingStatus(false)
  }
})

function handleSend() {
  const value = text.value.trim()
  if (!value) return

  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  sendTypingStatus(false)
  
  emit('send', value)
  text.value = ''
}

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  if (isTyping && props.channelId) {
    sendTypingStatus(false)
  }
})
</script>

<style scoped>
.chat-footer {
  padding: 16px 20px 24px 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input-wrapper {
  max-width: 100%;
}

.chat-input {
  border-radius: 8px;
}

.chat-input :deep(.q-field__control) {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  min-height: 42px;
  padding: 2px 8px;
}

.chat-input :deep(.q-field__control):hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.chat-input :deep(.q-field__control):focus-within {
  box-shadow: 0 0 0 3px rgba(97, 31, 105, 0.1);
}

.chat-input :deep(.q-field__native) {
  padding: 8px 4px;
  font-size: 15px;
}

</style>