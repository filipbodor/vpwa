<template>
  <q-page class="chat-page column">
    <!-- Chat messages container -->
    <div class="chat-container" ref="chatContainer">
      <div v-for="m in messages" :key="m.id" class="q-mb-xs">
        <q-card flat bordered class="q-pa-sm">
          <div class="text-caption text-grey">{{ m.user?.username || m.user_id }} • {{ m.created_at }}</div>
          <div>{{ m.content }}</div>
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
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { listMessages, postMessage, type Message } from 'src/services/api/channels';

const route = useRoute();
const text = ref('');
const chatContainer = ref<HTMLElement | null>(null);
const messages = ref<Message[]>([]);

async function loadMessages(channelId: number) {
  const res = await listMessages(channelId);
  messages.value = res;
  await nextTick();
  scrollToBottom();
}

watch(
  () => route.query.channelId,
  (val) => {
    const id = Number(val);
    if (id) loadMessages(id);
  },
  { immediate: true }
);

async function sendMessage() {
  const id = Number(route.query.channelId);
  if (!text.value.trim() || !id) return;
  const content = text.value;
  text.value = '';
  const msg = await postMessage(id, content);
  messages.value.push(msg);
  await nextTick();
  scrollToBottom();
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
