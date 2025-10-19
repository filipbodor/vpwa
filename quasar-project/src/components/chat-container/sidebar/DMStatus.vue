<template>
  <div class="row items-center q-gutter-sm">
    <q-badge :color="color" rounded />
    <span class="text-caption">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'online' | 'away' | 'busy' | 'offline' }>()

const color = ((): string => {
  switch (props.status) {
    case 'online': return 'green-6'
    case 'away': return 'amber-6'
    case 'busy': return 'red-6'
    default: return 'grey-5'
  }
})()

const label = ((): string => props.status)()
</script>


