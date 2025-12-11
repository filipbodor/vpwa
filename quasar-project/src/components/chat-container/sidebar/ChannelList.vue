<template>
  <div class="channel-list">
    <div class="section-header">
      <div class="section-title" @click="expanded = !expanded">
        <q-icon :name="expanded ? 'expand_more' : 'chevron_right'" size="18px" class="q-mr-xs expand-icon" />
        <span>Channels</span>
      </div>
      <div class="section-actions">
        <q-btn
          dense
          flat
          round
          size="sm"
          icon="refresh"
          color="grey-6"
          @click.stop="$emit('refresh')"
          class="header-btn"
        >
          <q-tooltip>Refresh channels</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          round
          size="sm"
          icon="add"
          color="grey-6"
          @click.stop="$emit('create')"
          class="header-btn"
        >
          <q-tooltip>Create channel</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div v-show="expanded" class="channel-items">
      <div
        v-for="ch in channels"
        :key="ch.id"
        :class="['channel-item', { 'new-invite': ch.isNewInvite }]"
        @click="$emit('open', ch)"
      >
        <div class="channel-main">
          <q-icon
            :name="ch.isPrivate ? 'lock' : 'tag'"
            size="18px"
            class="channel-icon"
          />
          <!-- Apply 'active' class if this is the current channel -->
          <span :class="['channel-name', { active: ch.id === currentChannelId }]">
            {{ ch.name }}
          </span>
          <q-badge v-if="ch.isNewInvite" color="primary" label="INVITED" class="invited-badge" />
        </div>
        <div class="channel-actions">
          <q-btn
            v-if="!isOwner(ch)"
            dense
            flat
            round
            size="sm"
            icon="logout"
            color="grey-7"
            @click.stop="$emit('leave', ch)"
            class="leave-btn"
          >
            <q-tooltip>Leave channel</q-tooltip>
          </q-btn>
          <q-btn
            v-if="isOwner(ch)"
            dense
            flat
            round
            size="sm"
            icon="delete_outline"
            color="grey-7"
            @click.stop="$emit('delete', ch)"
            class="delete-btn"
          >
            <q-tooltip>Delete channel</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Channel } from 'src/models/Channel'

const props = defineProps<{
  channels: Channel[]
  currentUserId?: string | number
  currentChannelId?: string
}>()
defineEmits(['open', 'create', 'leave', 'delete', 'refresh'])

const expanded = ref(true)

function isOwner(ch: Channel) {
  return props.currentUserId != null && props.currentUserId === ch.ownerId
}
</script>

<style scoped>
/* === KEEP ALL YOUR ORIGINAL CSS === */
.channel-list {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  height: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
  color: #1d1c1d;
  cursor: pointer;
  user-select: none;
}

.section-title:hover {
  color: #611f69;
}

.expand-icon {
  transition: transform 0.2s ease;
}

.section-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.section-header:hover .section-actions {
  opacity: 1;
}

.header-btn {
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: rgba(97, 31, 105, 0.08);
  color: #611f69 !important;
}

.channel-items {
  display: flex;
  flex-direction: column;
}

.channel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
  height: 28px;
  cursor: pointer;
  border-radius: 6px;
  margin: 0 8px;
  transition: background 0.15s ease;
}

.channel-item:hover {
  background: rgba(97, 31, 105, 0.08);
}

.channel-main {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.channel-icon {
  color: #616061;
  flex-shrink: 0;
}

.channel-name {
  font-size: 17px;
  color: #1d1c1d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* NEW: highlight active channel */
.channel-name.active {
  font-weight: 700;
  color: #611f69;
}

/* NEW: highlight new invites */
.channel-item.new-invite {
  background: rgba(33, 150, 243, 0.08);
  border-left: 3px solid #2196f3;
}

.channel-item.new-invite:hover {
  background: rgba(33, 150, 243, 0.15);
}

.invited-badge {
  font-size: 10px;
  padding: 2px 6px;
  font-weight: 600;
  margin-left: 4px;
}

.channel-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.channel-item:hover .channel-actions {
  opacity: 1;
}

.leave-btn:hover {
  color: #f59e0b !important;
}

.delete-btn:hover {
  color: #e01e5a !important;
}
</style>