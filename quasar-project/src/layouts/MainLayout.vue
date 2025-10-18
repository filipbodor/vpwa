<template>
  <q-layout view="lHh Lpr lFf" class="no-overflow">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Tu bude meno aktuálneho chatu a ak nebude žiaden otvorený tak názov apky
        </q-toolbar-title>
        <LogOutBtn />
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="column">
      <div class="chats scroll" style="flex: 1; overflow-y: auto;">
        <q-list>
          <q-item-label header>Chats</q-item-label>
          <chatContact
            v-for="contact in contacts"
            :key="contact.name"
            :name="contact.name"
            :last_message="contact.last_message"
            :icon="contact.icon"
          />
        </q-list>
      </div>

      <q-toolbar class="bg-blue text-white">
        <q-btn flat round dense icon="person" />
        <q-toolbar-title> Meno uzivatela </q-toolbar-title>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </q-drawer>

    <!-- Main page area -->
    <q-page-container class="no-overflow">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<!-- eslint-disable vue/block-lang -->

<script setup>
import LogOutBtn from 'src/components/LogOutBtn.vue';
import { ref } from 'vue';
import chatContact from 'components/EssentialLink.vue';
//import { name } from '@vue/eslint-config-prettier/skip-formatting';

const contacts = [
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },{ name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },{ name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.no-overflow {
  overflow: hidden !important;
  height: 100vh;
}
</style>
