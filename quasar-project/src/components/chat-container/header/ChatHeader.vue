<template>
  <q-header elevated class="chat-header">
    <q-toolbar class="chat-toolbar">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-drawer')"
        class="menu-btn"
      />
      <q-toolbar-title class="toolbar-title">
        <div class="channel-info">
          <q-icon name="tag" size="20px" class="channel-icon" />
          <span class="channel-name">
            <slot name="title">general</slot>
          </span>
        </div>
      </q-toolbar-title>
      
      <div class="toolbar-actions">
        <q-btn
          v-if="chat.activeThread.value?.type === 'channel'"
          flat
          dense
          round
          icon="info_outline"
          class="action-btn"
          @click="showChannelInfo"
        >
          <q-tooltip>Channel details</q-tooltip>
        </q-btn>
        <q-separator v-if="chat.activeThread.value?.type === 'channel'" vertical inset class="q-mx-sm" />
        <LogOutBtn />
      </div>
    </q-toolbar>

    <ChannelInfoModal
      v-model="channelInfoModalOpen"
      :channel-info="channelInfo"
      :users="users"
    />
  </q-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LogOutBtn from 'src/components/chat-container/header/include/LogOutBtn.vue'
import ChannelInfoModal from 'src/components/chat-container/header/include/ChannelInfoModal.vue'
import { useChat } from 'src/composables'
import { useUserStore } from 'src/stores/pinia-stores'

defineEmits(['toggle-drawer'])

const chat = useChat()
const userStore = useUserStore()

const channelInfoModalOpen = ref(false)

const channelInfo = computed(() => chat.activeChannelInfo.value)
const users = computed(() => userStore.users)

function showChannelInfo() {
  if (chat.activeThread.value?.type === 'channel') {
    channelInfoModalOpen.value = true
  }
}

defineExpose({ showChannelInfo })
</script>

<style scoped>
.chat-header {
  background: white;
  color: #1d1c1d;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.chat-toolbar {
  padding: 0 16px;
  min-height: 54px;
}

.menu-btn {
  margin-right: 8px;
  color: #616061;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background: rgba(97, 31, 105, 0.08);
  color: #611f69;
}

.toolbar-title {
  font-size: 18px;
  font-weight: 900;
  color: #1d1c1d;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-icon {
  color: #616061;
}

.channel-name {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.3px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  color: #616061;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(97, 31, 105, 0.08);
  color: #611f69;
}
</style>


