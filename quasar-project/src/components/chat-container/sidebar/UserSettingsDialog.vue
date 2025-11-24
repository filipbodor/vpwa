<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">User Settings</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <q-toggle
            v-model="notificationsEnabled"
            label="Enable Notifications"
            color="primary"
          />

          <q-toggle
            v-model="mentionsOnly"
            label="Mentions Only"
            color="primary"
            :disable="!notificationsEnabled"
          />
          <div class="text-caption text-grey-7 q-ml-lg" v-if="notificationsEnabled">
            When enabled, you'll only receive notifications for messages that mention you
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey-7" v-close-popup />
        <q-btn label="Save" color="primary" @click="handleSave" />
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
  'update:modelValue': [value: boolean]
}>()

const authStore = useAuthStore()

const notificationsEnabled = ref(authStore.currentUser?.notificationsEnabled !== false)
const mentionsOnly = ref(authStore.currentUser?.mentionsOnly || false)

watch(() => props.modelValue, (newVal) => {
  if (newVal && authStore.currentUser) {
    notificationsEnabled.value = authStore.currentUser.notificationsEnabled !== false
    mentionsOnly.value = authStore.currentUser.mentionsOnly || false
  }
})

async function handleSave() {
  try {
    await authStore.updateNotificationSettings({
      notificationsEnabled: notificationsEnabled.value,
      mentionsOnly: mentionsOnly.value,
    })

    Notify.create({
      message: 'Settings saved successfully',
      color: 'positive',
      position: 'top',
    })

    emit('update:modelValue', false)
  } catch (error) {
    Notify.create({
      message: 'Failed to save settings',
      color: 'negative',
      position: 'top',
    })
  }
}
</script>

