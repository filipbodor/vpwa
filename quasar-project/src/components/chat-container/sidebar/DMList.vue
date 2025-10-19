<template>
  <q-list separator>
    <q-item-label header>Direct Messages</q-item-label>
    <q-item v-for="dm in dms" :key="dm.id" clickable @click="$emit('open', dm)">
      <q-item-section avatar>
        <q-icon :name="dm.icon || 'person'" size="36px" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ dm.name }}</q-item-label>
        <q-item-label caption>{{ dm.last_message }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import type { DirectMessage } from 'src/models/DirectMessage'

defineProps<{ dms: DirectMessage[] }>()
defineEmits(['open'])
</script>


