<script setup lang="ts">
defineProps<{
  label: string
  value: string
  icon: string
  iconClass: string
  bgClass: string
}>()
</script>

<template>
  <UiSectionCard class="!p-4">
    <div class="flex items-center gap-4">
      <span
        class="flex size-14 shrink-0 items-center justify-center rounded-full"
        :class="bgClass"
      >
        <UIcon :name="icon" class="size-6" :class="iconClass" />
      </span>
      <div>
        <p class="text-sm text-slate-400">{{ label }}</p>
        <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ value }}</p>
      </div>
    </div>
  </UiSectionCard>
</template>
