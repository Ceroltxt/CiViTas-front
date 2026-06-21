<script setup lang="ts">
const projectDetail = useProjectDetail()
const detailOpen = ref(false)

const projects = [
  {
    name: 'Plataforma E-commerce',
    deadline: '25 de Dez. 2026',
    progress: 90,
    detail: projectDetail,
  },
  {
    name: 'Civitas Mobile',
    deadline: '15 de Set. 2026',
    progress: 77,
    detail: {
      name: 'Civitas Mobile',
      deadline: '15 de Set. 2026',
      progress: 77,
      description: 'Aplicativo mobile para colaboradores em campo.',
      daysRemaining: 86,
      totalTasks: 32,
      priority: 'media',
      taskStatus: { completed: 25, inProgress: 5, pending: 2 },
      progressTimeline: [
        { month: 'Mar', value: 15 },
        { month: 'Mai', value: 40 },
        { month: 'Jul', value: 65 },
        { month: 'Set', value: 77 },
      ],
    },
  },
  {
    name: 'Plataforma MEI',
    deadline: '30 de Out. 2026',
    progress: 45,
    detail: {
      name: 'Plataforma MEI',
      deadline: '30 de Out. 2026',
      progress: 45,
      description: 'Plataforma de gestão simplificada para microempreendedores individuais.',
      daysRemaining: 131,
      totalTasks: 20,
      priority: 'media',
      taskStatus: { completed: 9, inProgress: 8, pending: 3 },
      progressTimeline: [
        { month: 'Jun', value: 10 },
        { month: 'Ago', value: 30 },
        { month: 'Out', value: 45 },
      ],
    },
  },
]

const currentIndex = ref(0)
const currentProj = computed(() => projects[currentIndex.value])

function nextProject() {
  currentIndex.value = (currentIndex.value + 1) % projects.length
}

function prevProject() {
  currentIndex.value = (currentIndex.value - 1 + projects.length) % projects.length
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center justify-between">
      <p class="text-xs text-slate-400">Projeto atual</p>
      <div class="flex items-center gap-1">
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          class="size-6 p-0 flex items-center justify-center"
          @click="prevProject"
        >
          <UIcon name="i-heroicons-chevron-left" class="size-4" />
        </UButton>
        <span class="text-[10px] text-slate-400 font-mono">{{ currentIndex + 1 }}/{{ projects.length }}</span>
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          class="size-6 p-0 flex items-center justify-center"
          @click="nextProject"
        >
          <UIcon name="i-heroicons-chevron-right" class="size-4" />
        </UButton>
      </div>
    </div>
    <p class="mt-0.5 font-semibold text-slate-800 dark:text-slate-100">
      {{ currentProj.name }}
    </p>

    <p class="mt-4 text-xs text-slate-400">Prazo</p>
    <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{ currentProj.deadline }}</p>

    <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
      <span>Progresso geral</span>
      <span class="font-semibold text-slate-600 dark:text-slate-300">{{ currentProj.progress }}%</span>
    </div>
    <UiProgressBar :value="currentProj.progress" class="mt-1.5" gradient />

    <UButton
      block
      color="neutral"
      variant="outline"
      size="sm"
      class="mt-4"
      label="Ver com mais detalhes"
      @click="detailOpen = true"
    />

    <AppProjectDetailModal v-slot="{}" v-model:open="detailOpen" :project="currentProj.detail" />
  </div>
</template>
