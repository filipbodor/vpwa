<template>
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
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, watch, onMounted } from 'vue'

const props = defineProps<{
  messages: { sender: string; text: string }[]
}>()

const chatContainer = ref<HTMLElement | null>(null)

// Scroll whenever messages change
watch(
  () => props.messages,
  async () => {
    await nextTick()       // wait for DOM update
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
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 8px;
}
</style>