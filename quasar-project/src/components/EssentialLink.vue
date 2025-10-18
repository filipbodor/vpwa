<template>
  <q-item clickable>
    <q-item-section avatar>
      <q-icon :name="'person' || props.icon" size="36px" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ chatContact.name }}</q-item-label>
      <q-item-label caption>{{ chatContact.last_message }}</q-item-label>
    </q-item-section>
  </q-item>
  
</template>
<!-- eslint-disable vue/block-lang -->

<script setup>
const chatContact = defineProps({
  icon: String,
  name: {
    type: String,
    required: true,
  },
  last_message: String,
});
</script>
