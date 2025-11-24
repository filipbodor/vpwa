<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Notification Settings</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Notification Preferences</div>
          <q-toggle
            :model-value="localMentionsOnly"
            @update:model-value="handleToggle"
            label="Only notify me for @mentions"
            color="primary"
            :disable="isLoading"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from 'src/stores/pinia-stores'
import { Notify } from 'quasar'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const authStore = useAuthStore()
const localMentionsOnly = ref(authStore.mentionsOnly)
const isLoading = ref(false)

watch(() => authStore.mentionsOnly, (newVal) => {
  localMentionsOnly.value = newVal
})

async function handleToggle(value: boolean) {
  isLoading.value = true
  try {
    await authStore.updateNotificationSettings(value)
    localMentionsOnly.value = value
    Notify.create({
      message: 'Notification settings updated',
      color: 'positive',
      position: 'top',
      timeout: 2000,
    })
  } catch (error) {
    console.error('Failed to update notification settings:', error)
    Notify.create({
      message: 'Failed to update settings',
      color: 'negative',
      position: 'top',
      timeout: 2000,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.text-subtitle2 {
  font-weight: 600;
}
</style>

