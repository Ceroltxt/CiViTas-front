<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
  >
    <header
      v-if="title || $slots.action || $slots.header"
      class="mb-4 shrink-0 flex items-start justify-between gap-3"
    >
      <slot name="header">
        <div>
          <h2 class="font-semibold text-slate-800 dark:text-slate-100">{{ title }}</h2>
          <p v-if="subtitle" class="text-xs text-slate-400">{{ subtitle }}</p>
        </div>
      </slot>
      <slot name="action" />
    </header>
    <slot />
  </section>
</template>
