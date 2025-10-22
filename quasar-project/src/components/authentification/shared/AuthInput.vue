<template>
  <q-input
    :model-value="modelValue"
    :type="inputType"
    :label="label"
    outlined
    class="auth-input"
    :rules="rules"
    bg-color="white"
    label-color="grey-7"
    color="primary"
    @update:model-value="onUpdate"
  >
    <template v-slot:append v-if="isPassword">
      <q-icon
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="togglePassword"
      />
    </template>
  </q-input>
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

<style scoped>
.auth-input :deep(.q-field__control) {
  border-radius: 6px;
  min-height: 50px;
}

.auth-input :deep(.q-field__native) {
  font-size: 15px;
  padding: 12px 16px;
}

.auth-input :deep(.q-field__label) {
  font-size: 15px;
}
</style>


