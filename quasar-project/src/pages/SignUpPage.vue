<template>
  <div class="signup-page">
    <div class="signup-background">
      <div class="background-pattern"></div>
    </div>
    <div class="signup-content">
      <SignupForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import SignupForm from 'src/components/authentification/signup/SignupForm.vue'
</script>

<style scoped>
.signup-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.signup-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #611f69 0%, #4a154b 50%, #2c0e3a 100%);
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  background-size: 100% 100%;
}

.signup-content {
  position: relative;
  z-index: 1;
  padding: 24px;
  width: 100%;
  max-width: 570px;
}
</style>