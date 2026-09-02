<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

definePageMeta({ sidebarWidget: 'none' })

const projects = useUserProjects()
const current = useCurrentProject()
const selectedProjectId = ref(
  projects.find((p) => p.name === current.name)?.id ?? projects[0]?.id ?? '',
)

const selectedProject = computed(
  () => projects.find((p) => p.id === selectedProjectId.value) ?? projects[0],
)

const tabs = [
  { key: 'kanban', label: 'Kanban', icon: 'i-heroicons-squares-2x2' },
  { key: 'timeline', label: 'Timeline (Gantt)', icon: 'i-heroicons-bars-3-bottom-left' },
]
const activeTab = ref('kanban')

const teamFilter = ref('Todas')
const responsibleFilter = ref('Todos')
const priorityFilter = ref('Todas')
const search = ref('')
const projectOpen = ref(false)

// Obter tarefas do Supabase
const allTasks = useTasksData()

onMounted(() => {
  fetchTasksFromSupabase()
})

// Mapeamento dinâmico de tarefas reais do Supabase
const selectedProjectTasks = computed(() => {
  let list = allTasks.filter((t) => !t.personal)

  if (selectedProject.value?.name) {
    const projName = selectedProject.value.name.toLowerCase()
    const projFiltered = list.filter((t) => t.project?.toLowerCase() === projName)
    if (projFiltered.length > 0) {
      list = projFiltered
    }
  }

  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase()
    list = list.filter((t) => t.title.toLowerCase().includes(term))
  }
  if (priorityFilter.value !== 'Todas') {
    const pKey = priorityFilter.value.toLowerCase()
    list = list.filter((t) => t.priority === pKey)
  }

  return list
})
</script>

<template>
  <div class="space-y-5 p-4 sm:p-6">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Quadros</h1>
        <p class="text-sm text-slate-400">Acompanhe o andamento das tarefas e do projeto</p>
      </div>

      <UPopover v-model:open="projectOpen">
        <button
          type="button"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-violet-300 hover:bg-violet-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
        >
          <span
            class="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/40"
          >
            <UIcon name="i-heroicons-briefcase" class="size-5" />
          </span>
          <span class="text-left leading-tight">
            <span class="block text-xs text-slate-400">Projeto</span>
            <span class="block max-w-[12rem] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {{ selectedProject?.name }}
            </span>
          </span>
          <UIcon name="i-heroicons-chevron-down" class="size-4 shrink-0 text-slate-400" />
        </button>

        <template #content>
          <ul class="max-h-64 w-72 overflow-y-auto scroll-thin py-1">
            <li v-for="p in projects" :key="p.id">
              <button
                type="button"
                class="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
                :class="selectedProjectId === p.id ? 'bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/30' : 'text-slate-700 dark:text-slate-200'"
                @click="selectedProjectId = p.id; projectOpen = false"
              >
                <span class="size-2.5 shrink-0 rounded-full" :class="p.color" />
                <span class="min-w-0 flex-1 truncate">{{ p.name }}</span>
                <UIcon
                  v-if="selectedProjectId === p.id"
                  name="i-heroicons-check"
                  class="size-4 shrink-0 text-violet-600"
                />
              </button>
            </li>
          </ul>
        </template>
      </UPopover>
    </div>

    <!-- Abas -->
    <div class="flex gap-6 border-b border-slate-200 dark:border-slate-800">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
        :class="
          activeTab === tab.key
            ? 'border-violet-500 text-violet-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        "
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Sub-filtros -->
    <div class="flex flex-wrap items-center gap-3">
      <UiLabeledSelect v-model="teamFilter" label="Equipe:" :items="['Todas']" class="w-40" />
      <UiLabeledSelect v-model="responsibleFilter" label="Responsável:" :items="['Todos']" class="w-44" />
      <UiLabeledSelect v-model="priorityFilter" label="Prioridade:" :items="['Todas', 'Critica', 'Alta', 'Media', 'Baixa']" class="w-40" />
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Buscar Tarefa"
        class="w-full sm:w-56"
      />
    </div>

    <!-- Conteúdo da aba -->
    <QuadrosKanbanBoard v-if="activeTab === 'kanban'" :tasks="selectedProjectTasks" />
    <QuadrosGanttChart v-else-if="activeTab === 'timeline'" :tasks="selectedProjectTasks" />
  </div>
</template>
