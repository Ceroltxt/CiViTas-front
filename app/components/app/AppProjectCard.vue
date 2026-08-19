<script setup lang="ts">
const userProjects = useUserProjects()
const defaultDetail = useProjectDetail()
const detailOpen = ref(false)

const projects = computed(() => {
  if (!userProjects || userProjects.length === 0) return []
  return userProjects.map(p => ({
    name: p.name,
    deadline: 'Indefinido',
    progress: p.progress,
    detail: {
      ...defaultDetail,
      name: p.name,
      progress: p.progress,
    }
  }))
})

const currentIndex = ref(0)
const currentProj = computed(() => {
  if (projects.value.length === 0) return null
  return projects.value[currentIndex.value]
})

function nextProject() {
  if (projects.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % projects.value.length
}

function prevProject() {
  if (projects.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + projects.value.length) % projects.value.length
}
</script>

<template>
  <div v-if="currentProj" class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
