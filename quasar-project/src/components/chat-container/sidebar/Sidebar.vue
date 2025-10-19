<template>
  <q-drawer v-model="open" show-if-above bordered class="column">
    <div class="chats scroll" style="flex: 1; overflow-y: auto;">
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


