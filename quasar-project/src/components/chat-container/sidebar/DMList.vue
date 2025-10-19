<template>
  <div class="dm-list">
    <div class="section-header">
      <div class="section-title">
        <q-icon name="expand_more" size="18px" class="q-mr-xs" />
        <span>Direct Messages</span>
      </div>
      <div class="section-actions">
        <q-btn
          dense
          flat
          round
          size="sm"
          icon="edit"
          color="grey-6"
          class="header-btn"
        >
          <q-tooltip>New message</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="dm-items">
      <div
        v-for="dm in dms"
        :key="dm.id"
        class="dm-item"
        @click="$emit('open', dm)"
      >
        <div class="dm-avatar-wrapper">
          <q-avatar size="24px" color="grey-5">
            <q-icon :name="dm.icon || 'person'" size="16px" color="white" />
          </q-avatar>
          <DMStatus :status="dm.status || 'offline'" class="dm-status" />
        </div>
        <div class="dm-content">
          <span class="dm-name">{{ dm.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DirectMessage } from 'src/models/DirectMessage'
import DMStatus from 'src/components/chat-container/sidebar/DMStatus.vue'

defineProps<{ dms: DirectMessage[] }>()
defineEmits(['open'])
</script>

<style scoped>
.dm-list {
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

.dm-items {
  display: flex;
  flex-direction: column;
}

.dm-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
  height: 28px;
  cursor: pointer;
  border-radius: 6px;
  margin: 0 8px;
  transition: background 0.15s ease;
}

.dm-item:hover {
  background: rgba(97, 31, 105, 0.08);
}

.dm-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.dm-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
}

.dm-content {
  flex: 1;
  min-width: 0;
}

.dm-name {
  font-size: 15px;
  color: #1d1c1d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>


