<template>
  <q-drawer v-model="open" show-if-above bordered class="column">
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

    <UserBar />
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import chatContact from 'components/chat-container/sidebar/include/EssentialLink.vue'
import UserBar from 'src/components/chat-container/sidebar/UserBar.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const contacts = [
  { name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { name: 'Bob', last_message: 'Hello!' },
  { name: 'Charlie' },
]
</script>


