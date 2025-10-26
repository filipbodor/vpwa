<template>
  <q-input
    v-model="internalValue"
    :type="inputType"
    :label="label"
    :hint="hint"
    outlined
    class="auth-input"
    :rules="rules"
    bg-color="white"
    label-color="grey-7"
    color="primary"
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
import { computed, ref, watch } from 'vue'
import type { ValidationRule } from 'quasar'

const props = defineProps<{
  modelValue: string
  label: string
  type?: 'text' | 'email' | 'password'
  rules?: ValidationRule[]
  hint?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const isPassword = computed(() => (props.type ?? 'text') === 'password')
const showPassword = ref(false)
const inputType = computed(() => (isPassword.value && showPassword.value ? 'text' : props.type ?? 'text'))

const internalValue = ref(props.modelValue)
watch(() => props.modelValue, val => internalValue.value = val)
watch(internalValue, val => emit('update:modelValue', val))

function togglePassword() {
  if (isPassword.value) showPassword.value = !showPassword.value
}
</script>

<style scoped>
/* Keep it minimal: no forced padding or height */
.auth-input {
  width: 100%;
}
</style>