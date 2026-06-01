<script setup lang="ts">
defineProps<{
  /** rótulo curto exibido antes do valor (ex.: "Status:") */
  label: string
  items: (string | number)[]
}>()

const model = defineModel<string | number>()
</script>

<template>
  <div
    class="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white pl-2.5 dark:border-slate-700 dark:bg-slate-900"
  >
    <span class="shrink-0 text-xs text-slate-400">{{ label }}</span>
    <USelect
      v-model="model"
      :items="items"
      variant="none"
      class="min-w-0 flex-1"
      :ui="{ base: 'pl-0 pr-1' }"
    />
  </div>
</template>
