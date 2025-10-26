<template>
  <q-card flat class="login-card">
    <!-- Header -->
    <q-card-section class="text-center q-pb-lg">
      <div class="login-logo q-mb-md">
        <q-icon name="chat_bubble" size="48px" color="primary" />
      </div>
      <div class="login-title q-mb-xs">Welcome back</div>
      <div class="login-subtitle">
        Sign in to your workspace
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none q-px-lg">
      <q-form ref="loginForm" @submit.prevent="submitForm">
        <div class="q-mb-md">
          <AuthInput
            v-model="emailOrUsername"
            label="Email or Username"
            :rules="[(v) => !!v || 'Email or Username is required']"
            hint="You can use your email or username to sign in"
          />
        </div>
        <div class="q-mb-md">
          <AuthInput
            v-model="password"
            type="password"
            label="Password"
            :rules="[(v) => !!v || 'Password is required']"
          />
        </div>

        <q-btn
          label="Sign In"
          type="submit"
          color="primary"
          unelevated
          size="lg"
          class="full-width login-btn q-mb-md"
          no-caps
        />
      </q-form>

      <div class="text-center q-mb-lg">
        <q-btn
          label="Forgot password?"
          flat
          dense
          no-caps
          color="primary"
          class="text-weight-medium"
        />
      </div>

      <q-separator class="q-my-lg" />

      <div class="signup-section text-center">
        <div class="q-mb-sm text-body2 text-grey-7">Don't have an account?</div>
        <q-btn
          label="Create Account"
          outline
          color="primary"
          unelevated
          size="md"
          class="full-width"
          to="/signup"
          no-caps
        />
      </div>
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

const emailOrUsername = ref('')
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

<style scoped>
.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: white;
}

.login-logo {
  display: flex;
  justify-content: center;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1c1d;
  letter-spacing: -0.5px;
}

.login-subtitle {
  font-size: 18px;
  color: #616061;
}

.login-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  letter-spacing: 0.3px;
}

.signup-section {
  padding-bottom: 8px;
}
</style>