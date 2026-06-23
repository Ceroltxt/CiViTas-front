<script setup lang="ts">
const value = ref(0)
</script>

<template>
  <UProgress v-model="value" status color="secondary" />
</template>
