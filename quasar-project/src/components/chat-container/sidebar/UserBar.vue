<template>
  <q-toolbar class="bg-blue text-white">
    <q-btn flat round dense icon="person" />
    <q-toolbar-title>{{ username || 'Meno uzivatela' }}</q-toolbar-title>
    <q-btn flat round dense icon="more_vert">
      <q-menu anchor="bottom right" self="top right">
        <q-list style="min-width: 160px">
          <q-item clickable v-close-popup @click="setStatus('online')">
            <q-item-section avatar><q-badge color="green-6" rounded /></q-item-section>
            <q-item-section>Online</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="setStatus('away')">
            <q-item-section avatar><q-badge color="amber-6" rounded /></q-item-section>
            <q-item-section>Away</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="setStatus('busy')">
            <q-item-section avatar><q-badge color="red-6" rounded /></q-item-section>
            <q-item-section>Busy</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="setStatus('offline')">
            <q-item-section avatar><q-badge color="grey-5" rounded /></q-item-section>
            <q-item-section>Offline</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script setup lang="ts">
import { userStatus } from 'src/modules/chatController'

const { username } = defineProps<{ username?: string }>()

function setStatus(s: 'online' | 'away' | 'busy' | 'offline') {
  userStatus.value = s
}
</script>


