<!-- src/components/ChatInput.vue -->
<template>
    <div class="chat-footer row items-center">
      <q-input
        class="col rounded-input"
        outlined
        rounded
        v-model="text"
        placeholder="Type a message..."
        @keyup.enter="send"
      />
      <q-btn icon="send" round flat dense @click="send" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits } from 'vue'
  
  const emit = defineEmits<{
    (e: 'send', message: string): void
  }>()
  
  const text = ref('')
  
  function send() {
    if (!text.value.trim()) return
    emit('send', text.value)
    text.value = ''
  }
  </script>
  
  <style scoped>
  .chat-footer {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    background-color: #f5f5f5;
  }
  
  .rounded-input .q-field__control {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  </style>