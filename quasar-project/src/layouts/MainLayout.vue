<template>
  <q-layout view="lHh Lpr lFf" class="no-overflow">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          Tu bude meno aktuálneho chatu a ak nebude žiaden otvorený tak názov apky
        </q-toolbar-title>
        <LogOutBtn />
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="row items-center">
          <span>Channels</span>
          <q-space />
          <q-btn dense flat icon="refresh" @click="loadChannels" :loading="loadingChannels" />
          <q-btn dense flat icon="add" @click="showCreate = true" />
        </q-item-label>
        <q-item v-for="ch in channels" :key="ch.id" clickable @click="openChannel(ch.id)">
          <q-item-section>
            <q-item-label># {{ ch.name }}</q-item-label>
            <q-item-label caption>{{ ch.description }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat round icon="login" @click.stop="joinChannel(ch.id)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <CreateChannelDialog v-model="showCreate" :loading="creating" @submit="submitCreate" />

    <!-- Main page area -->
    <q-page-container class="no-overflow">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<!-- eslint-disable vue/block-lang -->

<script setup lang="ts">
import LogOutBtn from 'src/components/LogOutBtn.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listChannels, createChannel, joinChannel } from 'src/services/api/channels';
import CreateChannelDialog from 'src/components/sidebar/CreateChannelDialog.vue';

const router = useRouter();
const leftDrawerOpen = ref(false);
const channels = ref<{ id: number; name: string; description?: string | null }[]>([]);
const loadingChannels = ref(false);
const showCreate = ref(false);
const creating = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function loadChannels() {
  loadingChannels.value = true;
  try {
    const res = await listChannels();
    channels.value = res;
  } finally {
    loadingChannels.value = false;
  }
}

function openChannel(id: number) {
  router.push({ path: '/', query: { channelId: String(id) } });
}

onMounted(loadChannels);

async function submitCreate(payload: { name: string; description?: string }) {
  creating.value = true;
  try {
    const ch = await createChannel(payload)
    channels.value.unshift(ch)
    showCreate.value = false
    openChannel(ch.id)
  } catch (e: any) {
    
  } finally {
    creating.value = false
  }
}

</script>

<style scoped>
.no-overflow {
  overflow: hidden !important;
  height: 100vh;
}
</style>
