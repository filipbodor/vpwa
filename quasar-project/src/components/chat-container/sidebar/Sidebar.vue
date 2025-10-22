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
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="edit"
          color="white"
          class="workspace-btn"
        >
          <q-tooltip>Compose</q-tooltip>
        </q-btn>
      </div>

      <div class="sidebar-scroll">
        <ChannelList
          :channels="controller.channelViews.value"
          :current-user-id="'me'"
          @open="(ch) => controller.openChannel(String(ch.id))"
          @create="showCreate = true"
          @leave="(ch) => controller.leaveChannel(String(ch.id))"
          @delete="(ch) => controller.deleteChannel(String(ch.id))"
          @refresh="onRefreshChannels"
        />

        <DMList :dms="controller.dmViews.value" @open="(dm) => controller.openDM(String(dm.id))" />
      </div>

      <UserBar />
    </div>

    <CreateChannelDialog v-model="showCreate" @create="onCreateConfirmed" />
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UserBar from 'src/components/chat-container/sidebar/UserBar.vue'
import ChannelList from 'src/components/chat-container/sidebar/ChannelList.vue'
import DMList from 'src/components/chat-container/sidebar/DMList.vue'
import CreateChannelDialog from 'src/components/chat-container/sidebar/CreateChannelDialog.vue'
import { useChatController } from 'src/modules/chatController'
import type { Channel } from 'src/models/Channel'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const controller = useChatController()
const showCreate = ref(false)
function onCreateConfirmed(payload: { name: string; description?: string | undefined; isPrivate: boolean }) {
  controller.createChannel({ name: payload.name, description: payload.description, isPrivate: payload.isPrivate })
}
function onLeaveChannel(ch: Channel) { controller.leaveChannel(String(ch.id)) }
function onDeleteChannel(ch: Channel) { controller.deleteChannel(String(ch.id)) }
function onRefreshChannels() {}
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
</style>


