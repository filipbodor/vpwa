<template>
  <q-layout view="lHh Lpr lFf" class="no-overflow">
    <q-page-container class="no-overflow">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<!-- eslint-disable vue/block-lang -->

<script setup>
</script>

<style scoped>
.no-overflow {
  overflow: hidden !important;
  height: 100vh;
}
</style>
