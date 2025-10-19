<template>
  <q-dialog v-model="open">
    <q-card style="min-width: 420px">
      <q-card-section class="text-h6">Create channel</q-card-section>
      <q-card-section>
        <q-form @submit.prevent="submit">
          <q-input v-model="name" label="Name" outlined :rules="[(v) => !!v || 'Name is required']" class="q-mb-md" />
          <q-input v-model="description" label="Description" type="textarea" autogrow outlined class="q-mb-md" />
          <q-toggle v-model="isPrivate" label="Private channel" />
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn color="primary" label="Create" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'create', payload: { name: string; description?: string | undefined; isPrivate: boolean }): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const name = ref('')
const description = ref('')
const isPrivate = ref(false)

function submit() {
  const n = name.value.trim()
  if (!n) return
  emit('create', { name: n, description: description.value.trim() || undefined, isPrivate: !!isPrivate.value })
  open.value = false
}

watch(open, (v) => {
  if (!v) {
    name.value = ''
    description.value = ''
    isPrivate.value = false
  }
})
</script>


