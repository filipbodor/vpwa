<template>
  <q-card flat class="signup-card">
    <!-- Header -->
    <q-card-section class="text-center q-pb-lg">
      <div class="signup-logo q-mb-md">
        <q-icon name="chat_bubble" size="48px" color="primary" />
      </div>
      <div class="signup-title q-mb-xs">Create your account</div>
      <div class="signup-subtitle">
        Join your workspace
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none q-px-lg">
      <q-form ref="signupForm" @submit.prevent="submitForm">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <AuthInput
              v-model="firstName"
              label="First name"
              :rules="[(v) => !!v || 'First name is required']"
            />
          </div>
          <div class="col-6">
            <AuthInput
              v-model="lastName"
              label="Last name"
              :rules="[(v) => !!v || 'Last name is required']"
            />
          </div>
        </div>
        
        <div class="q-mb-md">
          <AuthInput
            v-model="email"
            type="email"
            label="Email address"
            :rules="[(v) => !!v || 'Email is required']"
          />
        </div>
        
        <div class="q-mb-md">
          <AuthInput
            v-model="password"
            type="password"
            label="Password"
            :rules="[(v) => !!v || 'Password is required', (v) => v.length >= 6 || 'Password must be at least 6 characters']"
          />
        </div>
        
        <div class="q-mb-md">
          <AuthInput
            v-model="repeatPassword"
            type="password"
            label="Confirm password"
            :rules="[(v) => !!v || 'Please confirm your password', (v) => v === password || 'Passwords do not match']"
          />
        </div>

        <q-btn
          label="Create Account"
          type="submit"
          color="primary"
          unelevated
          size="lg"
          class="full-width signup-btn q-mb-md"
          no-caps
        />
      </q-form>

      <q-separator class="q-my-lg" />
      
      <div class="login-section text-center">
        <div class="q-mb-sm text-body2 text-grey-7">Already have an account?</div>
        <q-btn
          label="Sign In"
          outline
          color="primary"
          unelevated
          size="md"
          class="full-width"
          to="/login"
          no-caps
        />
      </div>
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

<style scoped>
.signup-card {
  width: 100%;
  max-width: 520px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: white;
}

.signup-logo {
  display: flex;
  justify-content: center;
}

.signup-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1c1d;
  letter-spacing: -0.5px;
}

.signup-subtitle {
  font-size: 18px;
  color: #616061;
}

.signup-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  letter-spacing: 0.3px;
}

.login-section {
  padding-bottom: 8px;
}
</style>