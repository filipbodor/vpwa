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
        <AuthInput v-model="email" type="email" label="Email" :rules="[(v) => !!v || 'Email is required']" />
        <AuthInput v-model="password" type="password" label="Password" :rules="[(v) => !!v || 'Password is required']" />

        <q-btn label="Log In" type="submit" color="primary" class="full-width" />
      </q-form>

      <q-separator class="q-my-md" />
      <div class="text-center q-mb-md">Don’t have an account?</div>
      <q-btn label="Sign Up" color="primary" class="full-width" to="/signup" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'
import AuthInput from 'src/components/authentification/shared/AuthInput.vue'

const router = useRouter()
const loginForm = ref<QForm | null>(null)

const email = ref('')
const password = ref('')
const showPassword = ref(false)

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