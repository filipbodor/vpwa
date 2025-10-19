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
          :rules="[(val) => !!val || 'Password is required']"
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
        <q-btn label="Sign Up" type="submit" color="primary" class="full-width" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'

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