<template>
  <q-drawer
    v-model="open"
    show-if-above
    bordered
    class="sidebar-drawer"
    :width="260"
  >
    <div class="sidebar-content">
      <div class="workspace-header">
        <div class="workspace-name">Workspace</div>
      </div>

      <div class="sidebar-scroll">
        <ChannelList
          :channels="chat.channels.value"
          :current-user-id="chat.currentUserId.value"
          :current-channel-id="activeChannelId"
          @open="handleOpenChannel"
          @create="showCreate = true"
          @leave="handleLeaveChannel"
          @delete="handleDeleteChannel"
          @refresh="handleRefreshChannels"
        />
      </div>

      <UserBar />
    </div>

    <CreateChannelDialog v-model="showCreate" @create="handleCreateChannel" />
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UserBar from 'src/components/chat-container/sidebar/UserBar.vue'
import ChannelList from 'src/components/chat-container/sidebar/ChannelList.vue'
import CreateChannelDialog from 'src/components/chat-container/sidebar/CreateChannelDialog.vue'
import { useChat } from 'src/composables'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const chat = useChat()
const showCreate = ref(false)

const activeChannelId = ref<string>('')

async function handleCreateChannel(payload: { name: string; description?: string | undefined; isPrivate: boolean }) {
  try {
    const channelData = {
      name: payload.name,
      isPrivate: payload.isPrivate,
      ...(payload.description && { description: payload.description })
    }
    await chat.createChannel(channelData)
    showCreate.value = false
  } catch (error) {
    console.error('Failed to create channel:', error)
  }
}

// Channel actions
async function handleOpenChannel(ch: { id: string; isNewInvite?: boolean }) {
  activeChannelId.value = ch.id
  await chat.openChannel(ch.id)
  
  // Clear invite flag if this was a new invitation
  if (ch.isNewInvite) {
    await chat.clearChannelInvite(ch.id)
  }
}

async function handleLeaveChannel(ch: { id: string; name?: string }) {
  try {
    await chat.leaveChannel(ch.id)
    if (activeChannelId.value === ch.id) {
      activeChannelId.value = ''
    }
  } catch (error) {
    console.error('Failed to leave channel:', error)
  }
}

async function handleDeleteChannel(ch: { id: string }) {
  await chat.deleteChannel(ch.id)
  if (activeChannelId.value === ch.id) activeChannelId.value = ''
}

function handleRefreshChannels() {
}
</script>

<style scoped>
.sidebar-drawer {
  background: #ffffff;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #611f69 0%, #4a154b 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.workspace-name {
  font-size: 18px;
  font-weight: 900;
  color: white;
  letter-spacing: -0.3px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.workspace-name:hover {
  opacity: 0.9;
}

.workspace-btn {
  transition: all 0.2s ease;
}

.workspace-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.channel-name.active {
  font-weight: 700;
  color: #611f69;
}
</style>