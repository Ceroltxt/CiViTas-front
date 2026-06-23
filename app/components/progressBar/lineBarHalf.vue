<script setup lang="ts">
const value = ref(50)
</script>

<template>
  <UProgress v-model="value" status color="secondary" />
</template>
