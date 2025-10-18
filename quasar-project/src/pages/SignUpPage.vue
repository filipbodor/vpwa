<template>
  <div class="full-page flex flex-center" style="min-height: 100vh; background-color: #f0f0f0">
    <q-card bordered class="bg-white" style="width: 350px">
      <!-- Header -->
      <q-card-section class="text-center">
        <div class="text-h6 q-mb-sm">Login Form</div>
        <div class="text-subtitle2">
          Welcome to our Slack 2.0 <br />
          Please create an account
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section class="q-pt-none">
  <q-form ref="signupForm" @submit.prevent="submitForm">
    <q-input
      v-model="firstName"
      label="First Name"
      outlined
      class="q-mb-md"
      :rules="[(val) => !!val || 'First Name is required']"
    />
    <q-input
      v-model="lastName"
      label="Last Name"
      outlined
      class="q-mb-md"
      :rules="[(val) => !!val || 'Last Name is required']"
    />
    <q-input
      v-model="email"
      type="email"
      label="Email"
      outlined
      class="q-mb-md"
      :rules="[(val) => !!val || 'Email Name is required']"
    />
    <q-input
      v-model="password"
      :type="passwordInputType"
      label="Password"
      outlined
      class="q-mb-md"
      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
      @click:append="showPassword = !showPassword"
      :rules="[(val) => !!val || 'Password Name is required']"
    />
    <q-input
      v-model="repeatPassword"
      :type="passwordInputType"
      label="Repeat password"
      outlined
      class="q-mb-md"
      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
      @click:append="showPassword = !showPassword"
      :rules="[(val) => !!val || 'Repeat password is required']"
    />

    <!-- Submit button -->
    <q-btn :loading="loading" label="Sign Up" type="submit" color="primary" class="full-width" />
    <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
  </q-form>
</q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'
import { register } from 'src/services/api/auth'

const router = useRouter()
const signupForm = ref<QForm | null>(null)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const repeatPassword = ref('')

const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const passwordInputType = computed<'text' | 'password'>(() =>
  showPassword.value ? 'text' : 'password'
)

async function submitForm() {
  if (!signupForm.value) return

  const valid = await signupForm.value.validate()
  if (valid) {
    if (password.value !== repeatPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
    error.value = ''
    loading.value = true
    try {
      const username = `${firstName.value} ${lastName.value}`.trim()
      await register(username, email.value, password.value)
      await router.push('/')
    } catch (e: any) {
      error.value = e?.message || 'Signup failed'
    } finally {
      loading.value = false
    }
  } else {
    // Some fields are invalid
    console.log('Form is invalid!')
  }
}
</script>
