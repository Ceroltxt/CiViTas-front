<script setup lang="ts">
withDefaults(defineProps<{ showWordmark?: boolean }>(), {
  showWordmark: true,
})

// Referência a um asset de `public/` (URL em runtime, sem import no build).
const logoSrc = '/civitas-logo-transparent.png'
</script>

<template>
  <span class="inline-flex select-none items-center">
    <!-- Marca oficial: PNG (fundo transparente) exatamente como fornecido. -->
    <img
      :src="logoSrc"
      alt="Civitas"
      class="h-9 w-auto shrink-0 object-contain"
      draggable="false"
    >
  </span>
</template>
