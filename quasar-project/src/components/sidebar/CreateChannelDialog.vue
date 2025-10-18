<template>
  <BaseModal v-model="open" title="Create channel" ok-label="Create" :loading="loading" @ok="onSubmit">
    <q-form @submit.prevent="onSubmit">
      <q-input
        v-model="name"
        label="Name"
        outlined
        :rules="[(v) => !!v || 'Name is required']"
        class="q-mb-md"
        autofocus
      />
      <q-input
        v-model="description"
        label="Description"
        type="textarea"
        autogrow
        outlined
        class="q-mb-md"
      />
    </q-form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{ modelValue: boolean; loading?: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: { name: string; description?: string }): void
}>()

const name = ref('')
const description = ref('')

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const loading = computed(() => !!props.loading)

function close() {
  open.value = false
}

function onSubmit() {
  const trimmedName = name.value.trim()
  const trimmedDesc = description.value.trim()
  if (!trimmedName) return
  const payload: { name: string; description?: string } = { name: trimmedName }
  if (trimmedDesc) payload.description = trimmedDesc
  emit('submit', payload)
}

watch(
  () => props.modelValue,
  (v) => {
    if (!v) {
      name.value = ''
      description.value = ''
    }
  }
)
</script>


