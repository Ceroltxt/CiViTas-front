<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllProjectsFromSupabase } from '~/composables/useUserProjects'
import { useTasksRef } from '~/composables/useTasksData'

definePageMeta({ sidebarWidget: 'none' })

type ProjectStatus = 'planejamento' | 'ativo' | 'concluido' | 'pausado' | 'cancelado'

const projects = ref<any[]>([])
const isLoading = ref(true)

async function loadProjects() {
  isLoading.value = true
  projects.value = await fetchAllProjectsFromSupabase()
  isLoading.value = false
}

onMounted(loadProjects)

const tasks = useTasksRef()
const search = ref('')
const selectedStatus = ref<'todos' | ProjectStatus>('todos')

const statusMeta: Record<ProjectStatus, { label: string, class: string, dot: string }> = {
  planejamento: { label: 'Planejamento', class: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30', dot: 'bg-violet-500' },
  ativo: { label: 'Ativo', class: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30', dot: 'bg-emerald-500' },
  concluido: { label: 'Concluído', class: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30', dot: 'bg-blue-500' },
  pausado: { label: 'Pausado', class: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30', dot: 'bg-amber-500' },
  cancelado: { label: 'Cancelado', class: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30', dot: 'bg-rose-500' },
}

function projectTone(color: string) {
  const tones: Record<string, { surface: string, text: string }> = {
    'bg-blue-500': { surface: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500' },
    'bg-violet-500': { surface: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-500' },
    'bg-amber-400': { surface: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500' },
    'bg-pink-500': { surface: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-500' },
    'bg-cyan-500': { surface: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-500' },
    'bg-indigo-500': { surface: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-500' },
  }
  return tones[color] ?? { surface: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-500' }
}

const statusFilters: Array<{ value: 'todos' | ProjectStatus, label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'ativo', label: 'Ativos' },
  { value: 'concluido', label: 'Concluídos' },
  { value: 'pausado', label: 'Pausados' },
  { value: 'cancelado', label: 'Cancelados' },
]

const projectCards = computed(() => projects.value.map((project) => {
  const projectTasks = tasks.value.filter((task) => !task.personal && task.project === project.name)
  const done = projectTasks.filter((task) => task.status === 'concluido').length
  return {
    ...project,
    status: 'ativo' as ProjectStatus,
    description: project.description || 'Projeto em acompanhamento.',
    info: { priority: project.prioridade || 'Média', deadline: project.data_previsao_fim || 'Indefinido' },
    taskCount: projectTasks.length,
    doneCount: done,
  }
}))

const filteredProjects = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  return projectCards.value.filter((project) => {
    const matchesStatus = selectedStatus.value === 'todos' || project.status === selectedStatus.value
    const matchesSearch = !term || project.name.toLocaleLowerCase('pt-BR').includes(term)
    return matchesStatus && matchesSearch
  })
})

const newProjectOpen = ref(false)
const router = useRouter()

function openProject(projectId: string) {
  router.push(`/admin/projetos/${projectId}`)
}

function onProjectCreated() {
  loadProjects()
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Projetos</h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Gerencie todos os projetos e suas equipes alocadas.</p>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          color="primary"
          icon="i-heroicons-plus-circle"
          label="Criar novo projeto"
          class="bg-violet-600 hover:bg-violet-700 text-white"
          @click="newProjectOpen = true"
        />
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs text-slate-400">Total de projetos</p>
          <p class="mt-0.5 text-xl font-bold text-slate-800 dark:text-slate-100">{{ projectCards.length }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          type="button"
          class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
          :class="selectedStatus === filter.value ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'"
          @click="selectedStatus = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
      <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar projetos..." class="w-full sm:w-64" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="project in filteredProjects"
        :key="project.id"
        class="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30 cursor-pointer"
        @click="openProject(project.id)"
      >
        <div class="p-5 pb-4">
          <div class="flex items-start justify-between gap-3">
            <span class="grid size-14 place-items-center rounded-2xl" :class="projectTone(project.color).surface">
              <UIcon name="i-heroicons-folder" class="size-7" :class="projectTone(project.color).text" />
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1" :class="statusMeta[project.status].class">
              <span class="size-1.5 rounded-full" :class="statusMeta[project.status].dot" />
              {{ statusMeta[project.status].label }}
            </span>
          </div>
          <div class="mt-4">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ project.name }}</h2>
            <span class="mt-2 inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
              <UIcon name="i-heroicons-arrow-trending-up" class="size-3.5" />
              {{ project.info.priority }}
            </span>
          </div>
          <p class="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">{{ project.description }}</p>

          <div class="mt-5 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5"><UIcon name="i-heroicons-user" class="size-4" /> Macena Souza</span>
            <span v-if="project.info.deadline" class="flex items-center gap-1.5"><UIcon name="i-heroicons-calendar-days" class="size-4" /> {{ project.info.deadline }}</span>
            <span v-else class="flex items-center gap-1.5 text-slate-300"><UIcon name="i-heroicons-calendar-days" class="size-4" /> Sem prazo definido</span>
          </div>
          <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-2xl font-bold" :class="projectTone(project.color).text">{{ project.progress }}%</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ project.doneCount }} de {{ project.taskCount }} tarefas concluídas</p>
              </div>
              <div class="mb-1 h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div class="h-full rounded-full transition-all" :class="project.color" :style="{ width: `${project.progress}%` }" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
          <button type="button" class="flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-300" @click.stop="openProject(project.id)">
            Ver projeto <UIcon name="i-heroicons-arrow-right" class="size-4" />
          </button>
          <button type="button" class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" @click.stop="openProject(project.id)">
            <UIcon name="i-heroicons-list-bullet" class="size-4" />
            Tarefas
          </button>
        </div>
      </article>
    </div>

    <div v-if="!isLoading && filteredProjects.length === 0" class="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
      <UIcon name="i-heroicons-folder-open" class="mx-auto size-8 text-slate-300" />
      <p class="mt-3 text-sm font-medium text-slate-500">Nenhum projeto encontrado.</p>
    </div>

    <ProjetosNewProjectModal v-model:open="newProjectOpen" @created="onProjectCreated" />
  </div>
</template>
