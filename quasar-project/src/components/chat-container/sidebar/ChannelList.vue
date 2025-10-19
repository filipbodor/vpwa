<template>
  <q-list separator>
    <q-item-label header class="row items-center">
      <span>Channels</span>
      <q-space />
      <q-btn dense flat round icon="refresh" @click="$emit('refresh')" />
      <q-btn dense flat round icon="add" @click="$emit('create')" />
    </q-item-label>
    <q-item v-for="ch in channels" :key="ch.id" clickable @click="$emit('open', ch)">
      <q-item-section>
        <q-item-label>
          <q-icon name="lock" size="16px" class="q-mr-xs" v-if="ch.isPrivate" />
          # {{ ch.name }}
        </q-item-label>
        <q-item-label caption>{{ ch.description }}</q-item-label>
      </q-item-section>
      <q-item-section side class="row items-center q-gutter-xs">
        <q-badge v-if="ch.invited" color="amber-8" text-color="black">invited</q-badge>
        <q-btn dense flat round icon="delete" color="negative" @click.stop="$emit('delete', ch)" v-if="isOwner(ch)" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import type { Channel } from 'src/models/Channel'

const props = defineProps<{ channels: Channel[]; currentUserId?: string | number }>()
defineEmits(['open', 'create', 'leave', 'delete', 'refresh'])

function isOwner(ch: Channel) { return props.currentUserId != null && props.currentUserId === ch.ownerId }
</script> 


