<template>
  <q-toolbar class="bg-blue text-white">
    <q-btn flat round dense icon="person" />
    <q-toolbar-title>{{ username || 'Meno uzivatela' }}</q-toolbar-title>
    <q-btn flat round dense icon="more_vert" />
  </q-toolbar>
</template>

<script setup lang="ts">
const { username } = defineProps<{ username?: string }>()
</script>


