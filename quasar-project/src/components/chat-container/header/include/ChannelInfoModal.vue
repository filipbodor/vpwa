<template>
  <q-dialog v-model="isOpen" @hide="handleClose">
    <q-card style="min-width: 500px; max-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Channel Information</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="channelInfo">
        <div class="q-mb-md">
          <div class="text-subtitle1 text-weight-bold q-mb-xs">
            <q-icon name="tag" size="20px" class="q-mr-xs" />
            {{ channelInfo.name }}
          </div>
          <div v-if="channelInfo.description" class="text-body2 text-grey-7 q-mb-sm">
            {{ channelInfo.description }}
          </div>
          <div class="row q-gutter-sm q-mt-sm">
            <q-chip
              :icon="channelInfo.isPrivate ? 'lock' : 'public'"
              size="sm"
              :color="channelInfo.isPrivate ? 'orange' : 'green'"
              text-color="white"
            >
              {{ channelInfo.isPrivate ? 'Private' : 'Public' }}
            </q-chip>
            <q-chip icon="group" size="sm" color="primary" text-color="white">
              {{ channelInfo.memberCount }} {{ channelInfo.memberCount === 1 ? 'member' : 'members' }}
            </q-chip>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div>
          <div class="text-subtitle2 text-weight-bold q-mb-md">
            Members ({{ members.length }})
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item v-for="member in members" :key="member.id" class="q-pa-md">
              <q-item-section avatar>
                <q-avatar :color="getStatusColor(member.status)" text-color="white" size="40px">
                  {{ member.avatar || member.name.charAt(0) }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ member.name }}</q-item-label>
                <q-item-label caption>@{{ member.username }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip
                  :color="getStatusColor(member.status)"
                  text-color="white"
                  size="sm"
                  dense
                >
                  {{ member.status }}
                </q-chip>
              </q-item-section>

              <q-item-section side v-if="channelInfo.ownerId === member.id">
                <q-chip color="purple" text-color="white" size="sm" dense>
                  Owner
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <q-card-section v-else>
        <div class="text-center text-grey-6 q-pa-md">
          <q-icon name="info" size="48px" class="q-mb-sm" />
          <div>No channel selected</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User, UserStatus } from 'src/models'

const props = defineProps<{
  modelValue: boolean
  channelInfo: {
    id: string
    name: string
    description?: string
    isPrivate: boolean
    ownerId: string
    memberCount: number
    memberIds: string[]
  } | null
  users: Map<string, User>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const members = computed(() => {
  if (!props.channelInfo) return []
  return props.channelInfo.memberIds
    .map(id => props.users.get(id))
    .filter((user): user is User => user !== undefined)
    .sort((a, b) => {

        if (props.channelInfo!.ownerId === a.id) return -1
      if (props.channelInfo!.ownerId === b.id) return 1

      const statusOrder: Record<UserStatus, number> = { online: 0, away: 1, busy: 2, offline: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
})

function getStatusColor(status: UserStatus): string {
  const colors: Record<UserStatus, string> = {
    online: 'positive',
    away: 'warning',
    busy: 'negative',
    offline: 'grey'
  }
  return colors[status]
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>

