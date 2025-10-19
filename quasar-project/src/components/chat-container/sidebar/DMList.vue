<template>
  <q-list separator>
    <q-item-label header>Direct Messages</q-item-label>
    <q-item v-for="dm in dms" :key="dm.id" clickable @click="$emit('open', dm)">
      <q-item-section avatar>
        <q-icon :name="dm.icon || 'person'" size="36px" />
      </q-item-section>
      <q-item-section>
        <div class="row items-center justify-between">
          <q-item-label>{{ dm.name }}</q-item-label>
          <DMStatus :status="dm.status || 'offline'" />
        </div>
        <q-item-label caption>{{ dm.last_message }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import type { DirectMessage } from 'src/models/DirectMessage'
import DMStatus from 'src/components/chat-container/sidebar/DMStatus.vue'

defineProps<{ dms: DirectMessage[] }>()
defineEmits(['open'])
</script>


