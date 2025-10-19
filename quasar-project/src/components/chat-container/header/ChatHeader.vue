<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="$emit('toggle-drawer')" />
      <q-toolbar-title>
        <slot name="title">Slack 2.0</slot>
      </q-toolbar-title>
      <LogOutBtn />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import LogOutBtn from 'src/components/chat-container/header/include/LogOutBtn.vue'
defineEmits(['toggle-drawer'])
</script>


