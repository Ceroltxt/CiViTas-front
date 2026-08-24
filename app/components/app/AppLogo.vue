<script setup lang="ts">
withDefaults(defineProps<{ showWordmark?: boolean, collapsed?: boolean }>(), {
  showWordmark: true,
  collapsed: false
})

// Referência a um asset de `public/` (URL em runtime, sem import no build).
const logoSrc = '/civitas-logo-transparent.png'
const iconSrc = '/civitas-icon.png'
</script>

<template>
  <span class="inline-flex select-none items-center justify-center">
    <!-- Marca oficial: PNG (fundo transparente) exatamente como fornecido. -->
    <img
      v-if="collapsed"
      :src="iconSrc"
      alt="Civitas"
      class="h-8 w-auto shrink-0 object-contain"
      draggable="false"
    >
    <img
      v-else
      :src="logoSrc"
      alt="Civitas"
      class="h-9 w-auto shrink-0 object-contain"
      draggable="false"
    >
  </span>
</template>
