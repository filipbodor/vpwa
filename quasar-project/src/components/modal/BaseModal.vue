<template>
  <q-dialog v-model="open">
    <q-card style="min-width: 420px">
      <q-card-section class="text-h6">{{ title }}</q-card-section>
      <q-card-section>
        <slot />
      </q-card-section>
      <q-separator inset />
      <q-card-actions align="right">
        <slot name="actions">
          <q-btn flat label="Cancel" @click="close" />
          <q-btn color="primary" :label="okLabel" :loading="loading" @click="emitOk" />
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: boolean; title: string; okLabel?: string; loading?: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'ok'): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const okLabel = computed(() => props.okLabel ?? 'OK')
const loading = computed(() => !!props.loading)

function close() {
  open.value = false
}

function emitOk() {
  emit('ok')
}
</script>


