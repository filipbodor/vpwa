<template>
  <q-badge
    :color="color"
    rounded
    class="status-indicator"
  />
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
</script>

<style scoped>
.status-indicator {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 2px solid white;
}
</style>


