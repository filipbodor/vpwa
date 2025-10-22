<template>
  <q-btn
    flat
    dense
    round
    icon="logout"
    to="/LogIn"
    class="logout-btn"
    color="grey-7"
  >
    <q-tooltip>Log Out</q-tooltip>
  </q-btn>
</template>

<style scoped>
.logout-btn {
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(224, 30, 90, 0.1);
  color: #e01e5a !important;
}
</style>

