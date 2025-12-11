<template>
  <div class="user-bar">
    <div class="user-info">
      <q-avatar size="36px" color="primary" text-color="white">
        {{ avatar }}
      </q-avatar>
      <div class="user-details">
        <div class="user-name">{{ username }}</div>
        <div class="user-status-text">
          <q-badge
            :color="statusColor"
            rounded
            class="status-badge"
          />
          <span>{{ statusLabel }}</span>
        </div>
      </div>
    </div>
    <q-btn
      flat
      round
      dense
      size="sm"
      icon="more_vert"
      color="grey-7"
      class="more-btn"
    >
      <q-menu anchor="bottom left" self="top left" class="status-menu">
        <q-list style="min-width: 220px">
          <q-item-label header class="text-weight-bold">Set status</q-item-label>
          <q-separator />
          <q-item clickable v-close-popup @click="setStatus('online')" class="status-item">
            <q-item-section avatar>
              <q-badge color="green-6" rounded class="status-indicator" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Online</q-item-label>
              <q-item-label caption>Active</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="setStatus('dnd')" class="status-item">
            <q-item-section avatar>
              <q-badge color="red-6" rounded class="status-indicator" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Do Not Disturb</q-item-label>
              <q-item-label caption>No notifications</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="setStatus('offline')" class="status-item">
            <q-item-section avatar>
              <q-badge color="grey-5" rounded class="status-indicator" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Offline</q-item-label>
              <q-item-label caption>Not available</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-my-xs" />
          <q-item clickable v-close-popup @click="showSettings = true" class="status-item">
            <q-item-section avatar>
              <q-icon name="settings" size="xs" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notification Settings</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    
    <UserSettingsDialog v-model="showSettings" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChat } from 'src/composables'
import UserSettingsDialog from './UserSettingsDialog.vue'

const props = defineProps<{ username?: string }>()
const chat = useChat()
const showSettings = ref(false)

const username = computed(() => props.username || chat.currentUser.value?.fullName || 'Meno uzivatela')
const avatar = computed(() => {
  // Use the emoji from the user object or fallback
  return chat.currentUser.value?.avatar || '👤'
})

async function setStatus(s: 'online' | 'dnd' | 'offline') {
  try {
    await chat.updateStatus(s)
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const statusColor = computed(() => {
  switch (chat.userStatus.value) {
    case 'online': return 'green-6'
    case 'dnd': return 'red-6'
    case 'offline': return 'grey-5'
    default: return 'grey-5'
  }
})

const statusLabel = computed(() => {
  switch (chat.userStatus.value) {
    case 'online': return 'Online'
    case 'dnd': return 'Do Not Disturb'
    case 'offline': return 'Offline'
    default: return 'Offline'
  }
})
</script>

<style scoped>
.user-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #f8f8f8;
  transition: background 0.2s ease;
}

.user-bar:hover {
  background: #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.avatar-text {
  font-size: 16px;
  font-weight: 700;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #1d1c1d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #616061;
}

.status-badge {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 2px solid #f8f8f8;
}

.more-btn {
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.more-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.status-menu :deep(.q-item) {
  padding: 10px 16px;
}

.status-item {
  transition: background 0.15s ease;
}

.status-item:hover {
  background: rgba(97, 31, 105, 0.08);
}

.status-indicator {
  width: 12px;
  height: 12px;
  padding: 0;
}
</style>


