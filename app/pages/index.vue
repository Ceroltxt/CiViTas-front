<script setup lang="ts">
const { homePath } = useAppNavigation()

await navigateTo(homePath.value, { replace: true })
</script>

<template>
  <div />
</template>
