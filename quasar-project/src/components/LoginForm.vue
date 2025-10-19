<template>
  <q-card bordered class="bg-white" style="width: 350px">
    <!-- Header -->
    <q-card-section class="text-center">
      <div class="text-h6 q-mb-sm">Login Form</div>
      <div class="text-subtitle2">
        Welcome to our Slack 2.0 <br />
        Please login or create an account
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-form ref="loginForm" @submit.prevent="submitForm">

        <q-input
          v-model="email"
          type="email"
          label="Email"
          outlined
          class="q-mb-md"
          :rules="[(val) => !!val || 'Email is required']"
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

        <q-btn label="Log In" type="submit" color="primary" class="full-width" />
      </q-form>

      <q-separator class="q-my-md" />
      <div class="text-center q-mb-md">Don’t have an account?</div>
      <q-btn label="Sign Up" color="primary" class="full-width" to="/signup" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'

const router = useRouter()
const loginForm = ref<QForm | null>(null)

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const passwordInputType = computed<'text' | 'password'>(() =>
  showPassword.value ? 'text' : 'password'
)

async function submitForm() {
  if (!loginForm.value) return

  const valid = await loginForm.value.validate()
  if (valid) {
    await router.push('/')  // navigate after successful login
  } else {
    console.log('Form is invalid!')
  }
}
</script>