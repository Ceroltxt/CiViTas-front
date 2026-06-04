<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: number
    title?: string
    caption?: string
  }>(),
  {
    value: 85,
    title: 'Meta da equipe',
    caption: '85% das metas foram concluídas',
  },
)
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ title }}</p>
    <p class="mt-0.5 text-xs text-slate-400">{{ caption }}</p>

    <div class="mt-4 flex justify-center">
      <UiProgressRing :value="value" :size="120" />
    </div>

    <p class="mt-4 text-center text-xs font-medium text-slate-500">
      🏆 Meta alcançada!
    </p>
  </div>
</template>
