<template>
  <q-badge
    :color="color"
    rounded
    class="status-indicator"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: 'online' | 'dnd' | 'offline' }>()

const color = computed(() => {
  switch (props.status) {
    case 'online': return 'green-6'
    case 'dnd': return 'red-6'
    case 'offline': return 'grey-5'
    default: return 'grey-5'
  }
})
</script>

<style scoped>
.status-indicator {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 2px solid white;
}
</style>


