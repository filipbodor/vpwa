<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Tu bude meno aktualneho chatu a ak nebude ziaden otvoreny tak nazov apky </q-toolbar-title>


      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Chats </q-item-label>
        <chatContact
        v-for="contact in contacts"
        :key="contact.name"
        :name="contact.name"
        :last_message="contact.last_message"
        :icon="contact.icon"
        />

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<!-- eslint-disable vue/block-lang -->

<script setup >
import { ref } from 'vue';
import chatContact from 'components/EssentialLink.vue'
//import { name } from '@vue/eslint-config-prettier/skip-formatting';

const contacts = [
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
]

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
