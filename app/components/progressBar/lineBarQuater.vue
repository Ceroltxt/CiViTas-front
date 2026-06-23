<script setup lang="ts">
const value = ref(75)
</script>

<template>
  <UProgress v-model="value" status color="secondary" />
</template>
