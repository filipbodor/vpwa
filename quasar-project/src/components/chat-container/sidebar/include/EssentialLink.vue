<template>
  <q-item clickable>
  <q-item-section avatar>
    <q-icon :name="chatContact.icon || 'person'" size="36px" />
  </q-item-section>

    <q-item-section>
      <q-item-label>{{ chatContact.name }}</q-item-label>
      <q-item-label caption>{{ chatContact.last_message }}</q-item-label>
    </q-item-section>
  </q-item>
  
</template>
<!-- eslint-disable vue/block-lang -->

<script setup lang="ts">
const chatContact = defineProps<{ icon?: string | undefined; name: string; last_message?: string | undefined }>()
</script>
