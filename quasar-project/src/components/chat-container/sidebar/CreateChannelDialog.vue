<template>
  <q-dialog v-model="open">
    <q-card class="create-channel-dialog">
      <q-card-section class="dialog-header">
        <div class="dialog-title">Create a channel</div>
        <q-btn
          flat
          dense
          round
          icon="close"
          color="grey-7"
          v-close-popup
          class="close-btn"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-body">
        <div class="dialog-description q-mb-md">
          Channels are where your team communicates. They're best when organized around a topic — #marketing, for example.
        </div>

        <q-form @submit.prevent="submit">
          <div class="q-mb-md">
            <label class="input-label">Name</label>
            <q-input
              v-model="name"
              outlined
              dense
              placeholder="e.g. plan-budget"
              :rules="[
                (v) => !!v || 'Name is required',
                (v) => v.trim().length >= 3 || 'Name must be at least 3 characters'
              ]"
              class="channel-input"
            >
              <template v-slot:prepend>
                <span class="text-grey-7">#</span>
              </template>
            </q-input>
            <div class="input-hint">
              Names must be lowercase, without spaces or special characters (e.g. team-general)
            </div>
            <div v-if="showPreview" class="name-preview">
              Channel name will be: <strong>#{{ sanitizedName }}</strong>
            </div>
          </div>

          <div class="q-mb-lg">
            <label class="input-label">Description (optional)</label>
            <q-input
              v-model="description"
              type="textarea"
              outlined
              dense
              :rows="3"
              placeholder="What's this channel about?"
              class="channel-input"
            />
          </div>

          <div class="privacy-section q-mb-lg">
            <q-item tag="label" class="privacy-item">
              <q-item-section avatar>
                <q-checkbox v-model="isPrivate" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="privacy-label">Make private</q-item-label>
                <q-item-label caption class="privacy-caption">
                  When a channel is set to private, it can only be viewed or joined by invitation
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <q-separator class="q-mb-md" />

          <div class="dialog-actions">
            <q-btn
              flat
              label="Cancel"
              color="grey-7"
              v-close-popup
              no-caps
              class="action-btn"
            />
            <q-btn
              unelevated
              label="Create"
              type="submit"
              color="primary"
              no-caps
              class="action-btn create-btn"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { sanitizeChannelName } from 'src/composables/useCommands'

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

const sanitizedName = computed(() => {
  if (!name.value) return ''
  return sanitizeChannelName(name.value)
})

const showPreview = computed(() => {
  return name.value.trim() !== '' && sanitizedName.value !== name.value.trim()
})

function submit() {
  const n = name.value.trim()
  if (!n) return
  
  if (sanitizedName.value.length < 3) {
    return
  }
  
  emit('create', { 
    name: sanitizedName.value, 
    description: description.value.trim() || undefined, 
    isPrivate: !!isPrivate.value 
  })
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

<style scoped>
.create-channel-dialog {
  min-width: 520px;
  border-radius: 12px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.dialog-title {
  font-size: 22px;
  font-weight: 700;
  color: #1d1c1d;
}

.close-btn {
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dialog-body {
  padding: 24px;
}

.dialog-description {
  font-size: 14px;
  color: #616061;
  line-height: 1.5;
}

.input-label {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1d1c1d;
  margin-bottom: 8px;
}

.channel-input :deep(.q-field__control) {
  border-radius: 6px;
  min-height: 42px;
}

.channel-input :deep(.q-field__native) {
  font-size: 15px;
}

.privacy-section {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 8px;
}

.privacy-item {
  padding: 8px;
  border-radius: 6px;
}

.privacy-label {
  font-size: 15px;
  font-weight: 600;
  color: #1d1c1d;
}

.privacy-caption {
  font-size: 13px;
  color: #616061;
  line-height: 1.4;
  margin-top: 4px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn {
  min-width: 80px;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 20px;
}

.create-btn {
  background: #611f69;
}

.create-btn:hover {
  background: #4a154b;
}

.input-hint {
  font-size: 12px;
  color: #616061;
  margin-top: 4px;
  font-style: italic;
}

.name-preview {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 6px;
  font-size: 13px;
  color: #1d1c1d;
}

.name-preview strong {
  color: #1264a3;
  font-weight: 600;
}
</style>


