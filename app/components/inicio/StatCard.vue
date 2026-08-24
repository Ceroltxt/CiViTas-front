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
  <UiSectionCard class="!p-2.5 sm:!p-3">
    <div class="flex items-center gap-3">
      <span
        class="flex size-11 shrink-0 items-center justify-center rounded-full"
        :class="bgClass"
      >
        <UIcon :name="icon" class="size-[18px]" :class="iconClass" />
      </span>
      <div class="min-w-0">
        <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-400">{{ label }}</p>
        <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ value }}</p>
      </div>
    </div>
  </UiSectionCard>
</template>
