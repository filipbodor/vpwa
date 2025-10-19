<template>
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
        <AuthInput v-model="firstName" label="First Name" :rules="[(v) => !!v || 'First Name is required']" />
        <AuthInput v-model="lastName" label="Last Name" :rules="[(v) => !!v || 'Last Name is required']" />
        <AuthInput v-model="email" type="email" label="Email" :rules="[(v) => !!v || 'Email is required']" />
        <AuthInput v-model="password" type="password" label="Password" :rules="[(v) => !!v || 'Password is required']" />
        <AuthInput v-model="repeatPassword" type="password" label="Repeat password" :rules="[(v) => !!v || 'Repeat password is required']" />

        <!-- Submit button -->
        <q-btn label="Sign Up" type="submit" color="primary" class="full-width" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'
import AuthInput from 'src/components/authentification/shared/AuthInput.vue'

const router = useRouter()
const signupForm = ref<QForm | null>(null)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const showPassword = ref(false)

const passwordInputType = computed<'text' | 'password'>(() =>
  showPassword.value ? 'text' : 'password'
)

async function submitForm() {
  if (!signupForm.value) return

  const valid = await signupForm.value.validate()
  if (valid) {
    await router.push('/')
  } else {
    console.log('Form is invalid!')
  }
}
</script>