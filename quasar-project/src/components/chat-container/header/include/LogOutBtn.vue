<template>
  <q-btn
    flat
    dense
    round
    icon="logout"
    class="logout-btn"
    color="grey-7"
    @click="handleLogout"
    :loading="isLoading"
  >
    <q-tooltip>Log Out</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/pinia-stores'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

async function handleLogout() {
  isLoading.value = true
  try {
    await authStore.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.logout-btn {
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(224, 30, 90, 0.1);
  color: #e01e5a !important;
}
</style>

