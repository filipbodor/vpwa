<template>
  <div class="full-page flex flex-center" style="min-height: 100vh; background-color: #f0f0f0">
    <q-card bordered class="bg-white" style="width: 350px">
      <!-- Header -->
      <q-card-section class="text-center">
        <div class="text-h6 q-mb-sm">Login Form</div>
        <div class="text-subtitle2">
          Welcome to our Slack 2.0 <br />
          Please login create an account
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
  <q-form ref="signupForm" @submit.prevent="submitForm">

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
      :rules="[(val) => !!val || 'Password is required']"
    />


    <!-- Submit button -->
    <q-btn :loading="loading" label="Log In" type="submit" color="primary" class="full-width" />
    <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
  </q-form>
  <q-separator class="q-my-md" />
  <div class="text-center q-mb-md">Don’t have an account?</div>
      <q-btn label="Sign Up" type="button" color="primary" class="full-width" @click="router.push('/signup')" />
</q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'
import { login } from 'src/services/api/auth'

const router = useRouter()
const signupForm = ref<QForm | null>(null)

const email = ref('')

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
    error.value = ''
    loading.value = true
    try {
      await login(email.value, password.value)
      await router.push('/')
    } catch (e: any) {
      error.value = e?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  } else {
    // Some fields are invalid
    console.log('Form is invalid!')
  }
}
</script>
