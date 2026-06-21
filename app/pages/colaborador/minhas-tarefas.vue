<script setup lang="ts">
import type { PriorityKey } from '~/types'

definePageMeta({ sidebarWidget: 'none' })

const tasks = useTasksData()

const mainTabs = [
  { id: 'trabalho', icon: 'i-heroicons-briefcase', tooltip: 'Tarefas de Trabalho' },
  { id: 'pessoais', icon: 'i-heroicons-user', tooltip: 'Tarefas Pessoais' },
]
const subTabs = ['Atribuídas', 'Pendentes', 'Concluídas']
const sortOptions = ['Prazo', 'Prioridade', 'Progresso']

const activeMainTab = ref('trabalho')
const activeSubTab = ref('Atribuídas')

const search = ref('')
const projectFilter = ref('Todos')
const priorityFilter = ref('Todos')
const sortBy = ref('Prazo')
const newTaskOpen = ref(false)

// Opções de filtro derivadas dos metadados/dados — sem listas fixas.
const priorityOptions = usePriorityOptions()
const priorityFilterItems = ['Todos', ...priorityOptions.map((o) => o.label)]
const priorityByLabel = new Map<string, PriorityKey>(
  priorityOptions.map((o) => [o.label, o.value]),
)
const priorityRank = new Map<PriorityKey, number>(
  usePriorityList().map((key, i) => [key, i]),
)

const projectFilterItems = computed(() => [
  'Todos',
  ...new Set(tasks.flatMap((t) => (t.project ? [t.project] : []))),
])

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  const priorityKey = priorityByLabel.get(priorityFilter.value)

  let list = tasks.filter((t) => {
    const isPersonalTask = !!t.personal
    if ((activeMainTab.value === 'pessoais') !== isPersonalTask) return false

    if (activeSubTab.value === 'Atribuídas' && (t.status === 'concluido' || t.status === 'atrasado')) return false
    if (activeSubTab.value === 'Pendentes' && t.status !== 'atrasado') return false
    if (activeSubTab.value === 'Concluídas' && t.status !== 'concluido') return false

    if (term && !`${t.title} ${t.project ?? ''} ${t.team ?? ''}`.toLowerCase().includes(term)) return false
    if (projectFilter.value !== 'Todos' && t.project !== projectFilter.value) return false
    if (priorityKey && t.priority !== priorityKey) return false
    return true
  })

  if (sortBy.value === 'Progresso') {
    list = [...list].sort(
      (a, b) =>
        useProjectProgressForTask(b.project, b.projectProgress)
        - useProjectProgressForTask(a.project, a.projectProgress),
    )
  } else if (sortBy.value === 'Prioridade') {
    list = [...list].sort(
      (a, b) => (priorityRank.get(a.priority) ?? 99) - (priorityRank.get(b.priority) ?? 99),
    )
  } else if (sortBy.value === 'Prazo') {
    list = [...list].sort((a, b) => dueDateOrder(a.dueDate) - dueDateOrder(b.dueDate))
  }

  if (activeMainTab.value === 'pessoais') {
    list = [...list].sort((a, b) => {
      const aDone = a.status === 'concluido' ? 1 : 0
      const bDone = b.status === 'concluido' ? 1 : 0
      if (aDone !== bDone) return aDone - bDone
      return dueDateOrder(a.dueDate) - dueDateOrder(b.dueDate)
    })
  }

  return list
})

const showAccent = computed(
  () => activeSubTab.value === 'Atribuídas' || activeMainTab.value === 'pessoais',
)

const groups = computed(() => groupTasksByPriority(filtered.value))
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Minhas Tarefas</h1>
        <p class="text-sm text-slate-400">Acompanhe e gerencie todas as suas tarefas atribuídas</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="outline" icon="i-heroicons-arrow-down-tray" label="Exportar" />
        <UButton
          icon="i-heroicons-plus"
          label="Nova tarefa pessoal"
          class="bg-violet-600 hover:bg-violet-700"
          @click="newTaskOpen = true"
        />
      </div>
    </div>

    <!-- Abas Principais (Trabalho / Pessoais) -->
    <div class="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
      <button
        v-for="tab in mainTabs"
        :key="tab.id"
        type="button"
        class="p-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center"
        :class="
          activeMainTab === tab.id
            ? 'bg-white dark:bg-slate-900 text-violet-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        "
        :title="tab.tooltip"
        @click="activeMainTab = tab.id"
      >
        <UIcon :name="tab.icon" class="size-5" />
      </button>
    </div>

    <!-- Sub-abas -->
    <div class="flex gap-6 border-b border-slate-200 dark:border-slate-800">
      <button
        v-for="subTab in subTabs"
        :key="subTab"
        type="button"
        class="-mb-px border-b-2 pb-3 text-sm font-medium transition-colors"
        :class="
          activeSubTab === subTab
            ? 'border-violet-500 text-violet-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        "
        @click="activeSubTab = subTab"
      >
        {{ subTab }}
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap items-center gap-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Buscar Tarefa"
        class="w-full sm:w-56"
      />
      <UiLabeledSelect
        v-if="activeMainTab !== 'pessoais'"
        v-model="projectFilter"
        label="Projeto:"
        :items="projectFilterItems"
        class="w-40"
      />
      <UiLabeledSelect v-model="priorityFilter" label="Prioridade:" :items="priorityFilterItems" class="w-44" />
      <UiLabeledSelect
        v-if="activeMainTab !== 'pessoais'"
        v-model="sortBy"
        label="Ordenar:"
        :items="sortOptions"
        class="w-40"
      />
    </div>

    <!-- Lista agrupada -->
    <div class="space-y-6">
      <TarefasTaskGroup
        v-for="group in groups"
        :key="group.key"
        :priority="group.key"
        :tasks="group.tasks"
        :show-accent="showAccent"
      />

      <div
        v-if="groups.length === 0"
        class="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-700"
      >
        Nenhuma tarefa encontrada para os filtros selecionados.
      </div>
    </div>

    <TarefasNewTaskModal v-model:open="newTaskOpen" />
  </div>
</template>
