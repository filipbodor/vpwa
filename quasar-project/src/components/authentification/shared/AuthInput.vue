<template>
  <q-input
    :model-value="modelValue"
    :type="inputType"
    :label="label"
    outlined
    class="q-mb-md"
    :rules="rules"
    :append-icon="isPassword ? (showPassword ? 'visibility_off' : 'visibility') : undefined"
    @click:append="togglePassword"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ValidationRule } from 'quasar'

const props = defineProps<{
  modelValue: string
  label: string
  type?: 'text' | 'email' | 'password'
  rules?: ValidationRule[]
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const isPassword = computed(() => (props.type ?? 'text') === 'password')
const showPassword = ref(false)
const inputType = computed(() => {
  if (!isPassword.value) return props.type ?? 'text'
  return showPassword.value ? 'text' : 'password'
})

function togglePassword() {
  if (isPassword.value) showPassword.value = !showPassword.value
}

function onUpdate(v: string | number | null) {
  emit('update:modelValue', v == null ? '' : String(v))
}
</script>


