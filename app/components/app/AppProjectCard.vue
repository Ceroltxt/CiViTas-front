<script setup lang="ts">
const project = useCurrentProject()
const projectDetail = useProjectDetail()
const detailOpen = ref(false)
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <p class="text-xs text-slate-400">Projeto atual</p>
    <p class="mt-0.5 font-semibold text-slate-800 dark:text-slate-100">
      {{ project.name }}
    </p>

    <p class="mt-4 text-xs text-slate-400">Prazo</p>
    <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{ project.deadline }}</p>

    <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
      <span>Progresso geral</span>
      <span class="font-semibold text-slate-600 dark:text-slate-300">{{ project.progress }}%</span>
    </div>
    <UiProgressBar :value="project.progress" class="mt-1.5" gradient />

    <UButton
      block
      color="neutral"
      variant="outline"
      size="sm"
      class="mt-4"
      label="Ver com mais detalhes"
      @click="detailOpen = true"
    />

    <AppProjectDetailModal v-model:open="detailOpen" :project="projectDetail" />
  </div>
</template>
