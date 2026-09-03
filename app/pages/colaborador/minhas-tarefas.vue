<script setup lang="ts">
import type { CalendarEvent, PriorityKey, StatusKey, Task } from '~/types'
import { dueDateOrder, formatMonthLabel, MONTHS_SHORT } from '~/utils/date'

definePageMeta({ sidebarWidget: 'none' })

const tasks = useTasksData()
const currentUser = useCurrentUser()
import { deletePersonalTask, deletePersonalTasks, isPersonalTaskOverdue, updatePersonalTask, updatePersonalTasksPriority, updatePersonalTasksStatus, fetchTasksFromSupabase, type PersonalTaskStatus } from '~/composables/useTasksData'

onMounted(() => {
  fetchTasksFromSupabase(true)
})
const mainTabs = [
  { id: 'trabalho', label: 'Trabalho', icon: 'i-heroicons-briefcase', tooltip: 'Tarefas de Trabalho' },
  { id: 'pessoais', label: 'Pessoais', icon: 'i-heroicons-user', tooltip: 'Tarefas Pessoais' },
]
const route = useRoute()
const router = useRouter()
const activeMainTab = ref((route.query.aba as string) === 'pessoais' ? 'pessoais' : 'trabalho')
const viewOptions = [
  { id: 'lista', label: 'Lista', icon: 'i-heroicons-list-bullet' },
  { id: 'kanban', label: 'Kanban', icon: 'i-heroicons-squares-2x2' },
  { id: 'gantt', label: 'Gantt', icon: 'i-heroicons-bars-3-bottom-left' },
  { id: 'calendario', label: 'Calendário', icon: 'i-heroicons-calendar-days' },
] as const
const activeView = ref<typeof viewOptions[number]['id']>('lista')
const calendarCurrent = ref({ year: 2026, month: 4 })

watch(() => route.query.aba, (newAba) => {
  if (newAba === 'pessoais' || newAba === 'trabalho') {
    activeMainTab.value = newAba
  }
})

watch(activeMainTab, (newTab) => {
  router.replace({ query: { ...route.query, aba: newTab } })
  if (newTab === 'pessoais') {
    selectedStatuses.value = selectedStatuses.value.filter((status) => PERSONAL_STATUS_KEYS.includes(status as StatusKey))
  }
})

const sortOptions = ['Prazo', 'Prioridade', 'Status']
const search = ref('')
const searchOpen = ref(false)
const selectedProjects = ref<string[]>([])
type StatusFilterKey = StatusKey | 'pausado-cancelado'
const selectedStatuses = ref<StatusFilterKey[]>([])
const selectedPriorities = ref<PriorityKey[]>([])
const sortBy = ref('Status')
const newTaskOpen = ref(route.query.nova_tarefa === '1')
const projectFilterOpen = ref(false)
const statusFilterOpen = ref(false)
const priorityFilterOpen = ref(false)
const sortOpen = ref(false)

const editTaskOpen = ref(false)
const taskToEdit = ref<Task | null>(null)
const selectedTasks = ref<string[]>([])
const isSelecting = ref(false)
const bulkStatusOpen = ref(false)
const bulkPriorityOpen = ref(false)

watch(activeMainTab, () => {
  selectedTasks.value = []
  isSelecting.value = false
})

watch(activeView, () => {
  selectedTasks.value = []
  isSelecting.value = false
})

function toggleSelectionMode() {
  isSelecting.value = !isSelecting.value
  if (!isSelecting.value) {
    selectedTasks.value = []
  }
}

function bulkDelete() {
  if (confirm(`Tem certeza que deseja excluir as ${selectedTasks.value.length} tarefas selecionadas?`)) {
    deletePersonalTasks(selectedTasks.value)
    selectedTasks.value = []
  }
}

function bulkStatus(status: PersonalTaskStatus) {
  updatePersonalTasksStatus(selectedTasks.value, status)
  selectedTasks.value = []
  isSelecting.value = false
  bulkStatusOpen.value = false
}

function bulkPriority(priority: PriorityKey) {
  updatePersonalTasksPriority(selectedTasks.value, priority)
  selectedTasks.value = []
  isSelecting.value = false
  bulkPriorityOpen.value = false
}

function openEditTaskModal(task: Task) {
  taskToEdit.value = task
  editTaskOpen.value = true
}

function handleDeleteTask(taskId: string) {
  if (confirm('Tem certeza que deseja excluir esta tarefa pessoal?')) {
    deletePersonalTask(taskId)
  }
}

function handleKanbanMove(taskId: string, status: StatusKey) {
  if (!['a-fazer', 'em-andamento', 'concluido'].includes(status)) return
  const task = tasks.find((item) => item.id === taskId)
  if (task?.personal) updatePersonalTask({ ...task, status })
}

watch(() => route.query.nova_tarefa, (newVal) => {
  if (newVal === '1') {
    newTaskOpen.value = true
    router.replace({ query: { ...route.query, nova_tarefa: undefined } })
  }
})

// Se já abriu no mount, limpa a URL para não ficar suja
onMounted(() => {
  if (route.query.nova_tarefa === '1') {
    router.replace({ query: { ...route.query, nova_tarefa: undefined } })
  }
})

const priorityOptions = usePriorityOptions()
const personalStatusOptions: PersonalTaskStatus[] = ['a-fazer', 'em-andamento', 'concluido']
const priorityFlagColor: Record<PriorityKey, string> = {
  critica: 'text-red-500',
  alta: 'text-violet-500',
  media: 'text-amber-500',
  baixa: 'text-blue-500',
}
const priorityRank = new Map<PriorityKey, number>(
  usePriorityList().map((key, i) => [key, i]),
)

const statusOptions = useStatusOptions()
const PERSONAL_STATUS_KEYS: StatusKey[] = ['a-fazer', 'em-andamento', 'concluido', 'atrasado']
const availableStatuses = computed(() => activeMainTab.value === 'pessoais'
  ? PERSONAL_STATUS_KEYS.map((value) => ({ value, label: useStatusMeta(value).label }))
  : [
      ...statusOptions.map((option) => ({ value: option.value, label: option.label })),
      { value: 'pausado-cancelado' as const, label: 'Pausado/Cancelado' },
    ],
)

const statusRank = new Map<StatusKey, number>([
  ['a-fazer', 1],
  ['em-andamento', 2],
  ['em-revisao', 3],
  ['validar', 4],
  ['atrasado', 5],
  ['concluido', 6],
  ['bloqueado', 7],
  ['pausado', 8],
  ['cancelado', 9],
])

function compareByDueDate(a: Task, b: Task): number {
  const aOverdue = a.status === 'atrasado' || isPersonalTaskOverdue(a)
  const bOverdue = b.status === 'atrasado' || isPersonalTaskOverdue(b)

  if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
  return dueDateOrder(a.dueDate) - dueDateOrder(b.dueDate)
}

const projectFilterItems = computed(() => [...new Set(tasks.flatMap((task) => task.project ? [task.project] : []))])

const hasProjectFilter = computed(() => selectedProjects.value.length > 0)
const hasStatusFilter = computed(() => selectedStatuses.value.length > 0)
const hasPriorityFilter = computed(() => selectedPriorities.value.length > 0)
const projectFilterLabel = computed(() => selectedProjects.value.length === 0 ? 'Todos' : selectedProjects.value.length === 1 ? selectedProjects.value[0] : `${selectedProjects.value.length} projetos`)
const statusFilterLabel = computed(() => {
  if (selectedStatuses.value.length === 0) return 'Todos'
  if (selectedStatuses.value.length > 1) return `${selectedStatuses.value.length} status`
  const status = selectedStatuses.value[0]
  return status === 'pausado-cancelado' ? 'Pausado/Cancelado' : useStatusMeta(status).label
})
const priorityFilterLabel = computed(() => selectedPriorities.value.length === 0 ? 'Todas' : selectedPriorities.value.length === 1 ? usePriorityMeta(selectedPriorities.value[0]).label : `${selectedPriorities.value.length} prioridades`)

function toggleProjectFilter(project: string) {
  selectedProjects.value = selectedProjects.value.includes(project)
    ? selectedProjects.value.filter((item) => item !== project)
    : [...selectedProjects.value, project]
}

function toggleStatusFilter(status: StatusFilterKey) {
  selectedStatuses.value = selectedStatuses.value.includes(status)
    ? selectedStatuses.value.filter((item) => item !== status)
    : [...selectedStatuses.value, status]
}

function matchesStatusFilter(status: StatusKey): boolean {
  return selectedStatuses.value.includes(status)
    || (selectedStatuses.value.includes('pausado-cancelado') && (status === 'pausado' || status === 'cancelado'))
}

function togglePriorityFilter(priority: PriorityKey) {
  selectedPriorities.value = selectedPriorities.value.includes(priority)
    ? selectedPriorities.value.filter((item) => item !== priority)
    : [...selectedPriorities.value, priority]
}

function clearProjectFilter() { selectedProjects.value = [] }
function clearStatusFilter() { selectedStatuses.value = [] }
function clearPriorityFilter() { selectedPriorities.value = [] }

function closeSearchWhenEmpty() {
  if (!search.value.trim()) searchOpen.value = false
}

function clearSearch() {
  search.value = ''
  searchOpen.value = false
}

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()

  let list = tasks.filter((t) => {
    const isPersonalTask = !!t.personal
    if ((activeMainTab.value === 'pessoais') !== isPersonalTask) return false

    // If it's a work task, it MUST be assigned to the current user
    if (!isPersonalTask && currentUser) {
      if (!t.assignees || !t.assignees.some(a => a.id === currentUser.id || a.name === currentUser.name)) {
        return false
      }
    }

    // Search
    if (term) {
      if (!`${t.title} ${t.project ?? ''} ${t.team ?? ''}`.toLowerCase().includes(term)) return false
    }

    if (!isPersonalTask && hasProjectFilter.value && (!t.project || !selectedProjects.value.includes(t.project))) return false
    if (hasPriorityFilter.value && !selectedPriorities.value.includes(t.priority)) return false
    if (hasStatusFilter.value && !matchesStatusFilter(t.status)) return false
    return true
  })

  if (sortBy.value === 'Status') {
    list = [...list].sort(
      (a, b) => (statusRank.get(a.status) ?? 99) - (statusRank.get(b.status) ?? 99),
    )
  } else if (sortBy.value === 'Prioridade') {
    list = [...list].sort(
      (a, b) => (priorityRank.get(a.priority) ?? 99) - (priorityRank.get(b.priority) ?? 99),
    )
  } else if (sortBy.value === 'Prazo') {
    list = [...list].sort(compareByDueDate)
  }

  if (activeMainTab.value === 'pessoais') {
    list = [...list].sort((a, b) => {
      const aDone = a.status === 'concluido' ? 1 : 0
      const bDone = b.status === 'concluido' ? 1 : 0
      if (aDone !== bDone) return aDone - bDone
      if (sortBy.value === 'Status') {
        return (statusRank.get(a.status) ?? 99) - (statusRank.get(b.status) ?? 99)
      }
      if (sortBy.value === 'Prioridade') {
        return (priorityRank.get(a.priority) ?? 99) - (priorityRank.get(b.priority) ?? 99)
      }
      return compareByDueDate(a, b)
    })
  }

  return list
})

const calendarLabel = computed(() => formatMonthLabel(calendarCurrent.value.year, calendarCurrent.value.month))
// Estado da visualização de calendário
const calendarViewMode = ref<'mes' | 'semana' | '4dias' | 'dia'>('mes')
const calendarViewLabels = {
  mes: 'Mês',
  semana: 'Semana',
  '4dias': '4 dias',
  dia: 'Dia'
}

const timeGridBaseDate = computed(() => {
  const now = new Date()
  if (calendarCurrent.value.year === now.getFullYear() && calendarCurrent.value.month === now.getMonth()) {
    return now
  }
  return new Date(calendarCurrent.value.year, calendarCurrent.value.month, 1)
})

const calendarEvents = computed<CalendarEvent[]>(() => filtered.value.flatMap((task) => {
  if (!task.dueDate) return []
  const [dayText, monthText] = task.dueDate.split(' ')
  const startDay = Number(dayText)
  const month = MONTHS_SHORT.findIndex((item) => item.toLowerCase() === monthText?.slice(0, 3).toLowerCase())
  if (!Number.isInteger(startDay) || startDay < 1 || month !== calendarCurrent.value.month) return []

  const colorByPriority: Record<PriorityKey, CalendarEvent['color']> = {
    critica: 'pink', alta: 'violet', media: 'blue', baixa: 'green',
  }
  const isEditable = task.personal || (task.assignees && task.assignees.some(a => a.id === currentUser.id || a.name === currentUser.name))
  return [{ id: task.id, title: task.title, startDay, length: 1, color: colorByPriority[task.priority], editable: isEditable }]
}))

function shiftCalendarMonth(delta: number) {
  const date = new Date(calendarCurrent.value.year, calendarCurrent.value.month + delta, 1)
  calendarCurrent.value = { year: date.getFullYear(), month: date.getMonth() }
}

function goToCurrentMonth() {
  const now = new Date()
  calendarCurrent.value = { year: now.getFullYear(), month: now.getMonth() }
}

/** Todas as tarefas de trabalho são exportadas, sem depender dos filtros da tela. */
const workTasksForExport = computed(() => {
  let list = tasks.filter((task) => !task.personal)

  if (sortBy.value === 'Status') {
    list = [...list].sort((a, b) => (statusRank.get(a.status) ?? 99) - (statusRank.get(b.status) ?? 99))
  } else if (sortBy.value === 'Prioridade') {
    list = [...list].sort((a, b) => (priorityRank.get(a.priority) ?? 99) - (priorityRank.get(b.priority) ?? 99))
  } else {
    list = [...list].sort(compareByDueDate)
  }

  return list
})

function escapeCsvValue(value: string | number | undefined): string {
  const text = String(value ?? '')
  return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function exportWorkTasks() {
  downloadTasksAsCsv(workTasksForExport.value, 'tarefas-de-trabalho.csv')
}

function exportSelectedWorkTasks() {
  const selectedWorkTasks = workTasksForExport.value.filter((task) => selectedTasks.value.includes(task.id))
  downloadTasksAsCsv(selectedWorkTasks, 'tarefas-de-trabalho-selecionadas.csv')
  selectedTasks.value = []
  isSelecting.value = false
}

function exportSelectedPersonalTasks() {
  const selectedPersonalTasks = filtered.value.filter((task) => selectedTasks.value.includes(task.id))
  downloadTasksAsCsv(selectedPersonalTasks, 'tarefas-pessoais-selecionadas.csv')
  selectedTasks.value = []
  isSelecting.value = false
}

function downloadTasksAsCsv(tasksToExport: Task[], filename: string) {
  const header = ['Tarefa', 'Projeto', 'Status', 'Prioridade', 'Responsável', 'Prazo', 'Avaliação']
  const rows = tasksToExport.map((task) => [
    task.title,
    task.project,
    useStatusMeta(task.status).label,
    usePriorityMeta(task.priority).label,
    task.personal ? currentUser.name : task.assignees.map((assignee) => assignee.name).join(', '),
    task.dueDate,
    task.stars,
  ])
  // O BOM preserva os caracteres acentuados ao abrir o arquivo diretamente no Excel.
  const csv = `\uFEFF${[header, ...rows].map((row) => row.map(escapeCsvValue).join(';')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const activeFilterCount = computed(() => {
  return Number(hasProjectFilter.value) + Number(hasStatusFilter.value) + Number(hasPriorityFilter.value)
})

const appliedFilters = computed(() => {
  const filters: { key: 'project' | 'status' | 'priority'; label: string; value: string; icon: string }[] = []
  if (hasProjectFilter.value) {
    filters.push({ key: 'project', label: 'Projeto', value: projectFilterLabel.value, icon: 'i-heroicons-folder' })
  }
  if (hasStatusFilter.value) {
    filters.push({ key: 'status', label: 'Status', value: statusFilterLabel.value, icon: 'i-heroicons-list-bullet' })
  }
  if (hasPriorityFilter.value) {
    filters.push({ key: 'priority', label: 'Prioridade', value: priorityFilterLabel.value, icon: 'i-heroicons-flag' })
  }
  return filters
})

function clearFilter(key: 'project' | 'status' | 'priority') {
  if (key === 'project') clearProjectFilter()
  if (key === 'status') clearStatusFilter()
  if (key === 'priority') clearPriorityFilter()
}

// groups removed as we no longer use TaskGroup
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
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-down-tray"
          label="Exportar"
          @click="exportWorkTasks"
        />
        <UButton
          icon="i-heroicons-plus"
          label="Nova tarefa pessoal"
          class="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm font-medium transition-all"
          @click="activeMainTab = 'pessoais'; newTaskOpen = true"
        />
      </div>
    </div>

    <!-- Abas principais e modo de visualização -->
    <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-slate-200/80 dark:border-slate-800">
      <div class="flex items-center gap-1">
        <button
          v-for="tab in mainTabs"
          :key="tab.id"
          type="button"
          class="relative flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-center after:rounded-full after:transition-transform"
          :class="
            activeMainTab === tab.id
              ? 'text-slate-900 after:scale-x-100 after:bg-violet-500 dark:text-white'
              : 'text-slate-400 after:scale-x-0 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          "
          :title="tab.tooltip"
          @click="activeMainTab = tab.id"
        >
          <span
            class="flex size-6 items-center justify-center rounded-md transition-colors"
            :class="activeMainTab === tab.id ? (tab.id === 'trabalho' ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300' : 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300') : 'text-slate-400'"
          >
            <UIcon :name="tab.icon" class="size-4" />
          </span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div class="flex items-center gap-0.5 overflow-x-auto">
        <button
          v-for="view in viewOptions"
          :key="view.id"
          type="button"
          class="relative flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 text-xs font-semibold transition-colors after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:transition-transform sm:px-3 sm:text-sm"
          :class="activeView === view.id ? 'text-slate-800 after:scale-x-100 after:bg-violet-500 dark:text-slate-100' : 'text-slate-400 after:scale-x-0 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'"
          @click="activeView = view.id"
        >
          <UIcon
            :name="view.icon"
            class="size-4"
            :class="{
              'text-violet-600': view.id === 'lista',
              'text-sky-600': view.id === 'kanban',
              'text-rose-500': view.id === 'gantt',
              'text-amber-500': view.id === 'calendario',
            }"
          />
          <span>{{ view.label }}</span>
        </button>
      </div>
    </div>

    <!-- Barra de Controle Contextual -->
    <div class="space-y-2.5">
      <!-- Busca recolhível -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div v-if="searchOpen" class="relative w-full sm:w-[480px] lg:w-[520px] xl:w-[560px]">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar tarefa..."
            size="lg"
            autofocus
            class="w-full"
            @blur="closeSearchWhenEmpty"
            @keydown.esc="clearSearch"
          />
          <button
            v-if="search"
            type="button"
            class="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Limpar busca"
            @click="clearSearch"
          >
            <UIcon name="i-heroicons-x-mark" class="size-4" />
          </button>
        </div>
      </Transition>

      <!-- Filtros -->
        <div class="flex flex-nowrap items-center justify-start gap-1.5 py-1 w-full overflow-x-auto hide-scrollbar">

        <button
          type="button"
          class="flex size-[30px] shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
          :class="searchOpen && 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300'"
          aria-label="Buscar tarefa"
          title="Buscar tarefa"
          @click="searchOpen = true"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="size-3.5" />
        </button>

        <!-- Projeto -->
        <UPopover v-if="activeMainTab !== 'pessoais'" v-model:open="projectFilterOpen">
          <button type="button" class="flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-sm transition-all hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900" :class="hasProjectFilter && 'border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20'">
            <UIcon name="i-heroicons-folder" class="mr-1 size-3.5 shrink-0 text-violet-500" />
            <span class="mr-1 hidden whitespace-nowrap text-[11px] text-slate-500 md:inline xl:text-[12px]">Projeto:</span>
            <span class="max-w-24 truncate pr-3 text-[11px] font-medium text-slate-700 dark:text-slate-200 xl:text-[12px]">{{ projectFilterLabel }}</span>
            <UIcon name="i-heroicons-chevron-down" class="size-3 shrink-0 text-slate-400" />
          </button>
          <template #content>
            <div class="w-72 p-1.5">
              <div class="flex items-center justify-between px-2 py-1.5">
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Filtrar projetos</span>
                <button v-if="hasProjectFilter" type="button" class="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400" @click="clearProjectFilter">Limpar filtros</button>
              </div>
              <ul class="max-h-64 overflow-y-auto scroll-thin">
                <li v-for="project in projectFilterItems" :key="project">
                  <button type="button" class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30" :class="selectedProjects.includes(project) && 'bg-violet-50 dark:bg-violet-950/30'" @click="toggleProjectFilter(project)">
                    <span class="size-2.5 shrink-0 rounded-full" :class="useProjectDotColor(project)" />
                    <span class="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{{ project }}</span>
                    <span class="flex size-4 shrink-0 items-center justify-center rounded border" :class="selectedProjects.includes(project) ? 'border-[#b64fc2] bg-[#bd52c9] text-white' : 'border-slate-300 dark:border-slate-600'"><UIcon v-if="selectedProjects.includes(project)" name="i-heroicons-check" class="size-3" /></span>
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </UPopover>

      <!-- Status -->
      <UPopover v-model:open="statusFilterOpen">
        <button type="button" class="flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-sm transition-all hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900" :class="hasStatusFilter && 'border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20'">
          <UIcon name="i-heroicons-list-bullet" class="mr-1 size-3.5 shrink-0 text-violet-500" />
          <span class="mr-1 hidden whitespace-nowrap text-[11px] text-slate-500 md:inline xl:text-[12px]">Status:</span>
          <span class="max-w-24 truncate pr-3 text-[11px] font-medium text-slate-700 dark:text-slate-200 xl:text-[12px]">{{ statusFilterLabel }}</span>
          <UIcon name="i-heroicons-chevron-down" class="size-3 shrink-0 text-slate-400" />
        </button>
        <template #content>
          <div class="w-64 p-1.5">
            <div class="flex items-center justify-between px-2 py-1.5">
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Filtrar status</span>
              <button v-if="hasStatusFilter" type="button" class="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400" @click="clearStatusFilter">Limpar filtros</button>
            </div>
            <ul>
              <li v-for="status in availableStatuses" :key="status.value">
                <button type="button" class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30" :class="selectedStatuses.includes(status.value) && 'bg-violet-50 dark:bg-violet-950/30'" @click="toggleStatusFilter(status.value)">
                  <span class="min-w-0 flex-1 text-slate-700 dark:text-slate-200">{{ status.label }}</span>
                  <span class="flex size-4 shrink-0 items-center justify-center rounded border" :class="selectedStatuses.includes(status.value) ? 'border-[#b64fc2] bg-[#bd52c9] text-white' : 'border-slate-300 dark:border-slate-600'"><UIcon v-if="selectedStatuses.includes(status.value)" name="i-heroicons-check" class="size-3" /></span>
                </button>
              </li>
            </ul>
          </div>
        </template>
      </UPopover>

      <!-- Prioridade -->
      <UPopover v-model:open="priorityFilterOpen">
        <button type="button" class="flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-sm transition-all hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900" :class="hasPriorityFilter && 'border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20'">
          <UIcon name="i-heroicons-flag" class="mr-1 size-3.5 shrink-0 text-violet-500" />
          <span class="mr-1 hidden whitespace-nowrap text-[11px] text-slate-500 md:inline xl:text-[12px]">Prioridade:</span>
          <span class="max-w-24 truncate pr-3 text-[11px] font-medium text-slate-700 dark:text-slate-200 xl:text-[12px]">{{ priorityFilterLabel }}</span>
          <UIcon name="i-heroicons-chevron-down" class="size-3 shrink-0 text-slate-400" />
        </button>
        <template #content>
          <div class="w-64 p-1.5">
            <div class="flex items-center justify-between px-2 py-1.5">
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Filtrar prioridades</span>
              <button v-if="hasPriorityFilter" type="button" class="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400" @click="clearPriorityFilter">Limpar filtros</button>
            </div>
            <ul>
              <li v-for="priority in priorityOptions" :key="priority.value">
                <button type="button" class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30" :class="selectedPriorities.includes(priority.value) && 'bg-violet-50 dark:bg-violet-950/30'" @click="togglePriorityFilter(priority.value)">
                  <UIcon name="i-heroicons-flag-20-solid" class="size-4 shrink-0" :class="priorityFlagColor[priority.value]" />
                  <span class="min-w-0 flex-1 font-medium text-slate-700 dark:text-slate-200">{{ priority.label }}</span>
                  <span class="flex size-4 shrink-0 items-center justify-center rounded border" :class="selectedPriorities.includes(priority.value) ? 'border-[#b64fc2] bg-[#bd52c9] text-white' : 'border-slate-300 dark:border-slate-600'"><UIcon v-if="selectedPriorities.includes(priority.value)" name="i-heroicons-check" class="size-3" /></span>
                </button>
              </li>
            </ul>
          </div>
        </template>
      </UPopover>

      <!-- Ordenar -->
      <UPopover v-model:open="sortOpen">
        <button type="button" class="flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-sm transition-all hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900">
          <UIcon name="i-heroicons-arrows-up-down" class="mr-1 size-3.5 shrink-0 text-violet-500" />
          <span class="mr-1 hidden whitespace-nowrap text-[11px] text-slate-500 md:inline xl:text-[12px]">Ordenar:</span>
          <span class="max-w-24 truncate pr-3 text-[11px] font-medium text-slate-700 dark:text-slate-200 xl:text-[12px]">{{ sortBy }}</span>
          <UIcon name="i-heroicons-chevron-down" class="size-3 shrink-0 text-slate-400" />
        </button>
        <template #content>
          <div class="w-52 p-1.5">
            <p class="px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Ordenar por</p>
            <button v-for="option in sortOptions" :key="option" type="button" class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30" :class="sortBy === option && 'bg-violet-50 dark:bg-violet-950/30'" @click="sortBy = option; sortOpen = false">
              <UIcon name="i-heroicons-arrows-up-down" class="size-4 text-violet-500" />
              <span class="flex-1 text-slate-700 dark:text-slate-200">{{ option }}</span>
              <UIcon v-if="sortBy === option" name="i-heroicons-check" class="size-4 text-violet-600" />
            </button>
          </div>
        </template>
      </UPopover>

      <!-- Filtros ativos: menu para visualizar e remover filtros sem procurar o seletor. -->
      <UPopover :ui="{ content: 'w-72' }">
        <button
          type="button"
          class="ml-auto flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-2.5 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800 dark:hover:bg-violet-950/20"
          aria-label="Ver filtros aplicados"
        >
          <UIcon name="i-heroicons-funnel" class="size-3.5 text-violet-500 sm:mr-1.5" />
          <span class="mr-1.5 hidden text-[11px] font-medium text-slate-700 dark:text-slate-200 md:inline">Filtros</span>
          <span class="flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-100 px-1 text-[10px] font-bold text-violet-600 dark:bg-violet-900/50 dark:text-violet-300">
            {{ activeFilterCount }}
          </span>
        </button>

        <template #content>
          <div class="p-2">
            <div class="flex items-center justify-between px-2 py-1.5">
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Filtros aplicados</span>
              <span class="text-xs text-slate-400">{{ activeFilterCount }}</span>
            </div>
            <div v-if="appliedFilters.length" class="space-y-1">
              <button
                v-for="filter in appliedFilters"
                :key="filter.key"
                type="button"
                class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                :title="`Remover filtro ${filter.label}: ${filter.value}`"
                @click="clearFilter(filter.key)"
              >
                <UIcon :name="filter.icon" class="size-4 text-violet-500" />
                <span class="min-w-0 flex-1">
                  <span class="block text-[11px] text-slate-400">{{ filter.label }}</span>
                  <span class="block truncate text-sm font-medium text-slate-700 dark:text-slate-200">{{ filter.value }}</span>
                </span>
                <UIcon name="i-heroicons-x-mark" class="size-4 text-slate-400" />
              </button>
            </div>
            <div v-else class="px-2 py-5 text-center">
              <UIcon name="i-heroicons-adjustments-horizontal" class="mx-auto mb-2 size-5 text-slate-300 dark:text-slate-600" />
              <p class="text-xs text-slate-400">Nenhum filtro aplicado.</p>
            </div>
          </div>
        </template>
      </UPopover>
      </div>
    </div>

    <!-- Lista / Tabela -->
    <div v-if="activeView === 'lista'" class="-mt-3 space-y-2">
      <div class="flex items-center justify-between px-1">
        <p class="text-xs text-slate-400 dark:text-slate-500">
          <template v-if="activeMainTab === 'pessoais'">
            {{ filtered.length }} {{ filtered.length === 1 ? 'tarefa pessoal' : 'tarefas pessoais' }}
          </template>
          <template v-else>
            {{ filtered.length }} {{ filtered.length === 1 ? 'tarefa de trabalho' : 'tarefas de trabalho' }}
          </template>
        </p>
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          :icon="isSelecting ? 'i-heroicons-x-mark' : 'i-heroicons-check-circle'"
          :label="isSelecting ? 'Cancelar seleção' : 'Selecionar'"
          class="text-slate-500 hover:text-violet-600 dark:hover:text-violet-300"
          @click="toggleSelectionMode"
        />
      </div>
      <TarefasTaskTable
        v-if="filtered.length > 0"
        :tasks="filtered"
        :is-personal="activeMainTab === 'pessoais'"
        :is-selecting="isSelecting"
        v-model:selected-ids="selectedTasks"
        @edit="openEditTaskModal"
        @delete="handleDeleteTask"
      />

      <div
        v-if="filtered.length === 0"
        class="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-700"
      >
        Nenhuma tarefa encontrada para os filtros selecionados.
      </div>
    </div>

    <QuadrosKanbanBoard
      v-else-if="activeView === 'kanban'"
      :tasks="filtered"
      :interactive="activeMainTab === 'pessoais'"
      @move="handleKanbanMove"
      @edit="openEditTaskModal"
      @delete="handleDeleteTask"
    />

    <QuadrosGanttChart 
      v-else-if="activeView === 'gantt'" 
      :tasks="filtered" 
      :is-selecting="isSelecting"
      v-model:selected-ids="selectedTasks"
      @edit="openEditTaskModal"
      @add-task="activeMainTab = 'pessoais'; newTaskOpen = true"
      @selection-started="isSelecting = true"
    />

    <div v-else class="space-y-4">
      <div class="flex items-center gap-4">
        <!-- Controles do lado esquerdo -->
        <div class="flex items-center gap-2">
          <!-- Botão Hoje -->
          <UButton color="white" variant="solid" size="sm" label="Hoje" class="font-medium text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700" @click="goToCurrentMonth" />
          
          <!-- Dropdown Mês/Semana/Dia -->
          <UPopover mode="click">
            <UButton color="white" variant="solid" size="sm" :label="calendarViewLabels[calendarViewMode]" trailing-icon="i-heroicons-chevron-down" class="font-medium text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700" />
            <template #content>
              <div class="p-2 w-48 shadow-sm">
                <span class="text-[11px] font-semibold text-slate-400 block px-2 mb-1">Período de tempo</span>
                <button 
                  class="flex items-center justify-between w-full px-2 py-1.5 rounded transition-colors text-sm"
                  :class="calendarViewMode === 'dia' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'"
                  @click="calendarViewMode = 'dia'"
                >
                  <span>Dia</span>
                  <UKbd>D</UKbd>
                </button>
                <button 
                  class="flex items-center justify-between w-full px-2 py-1.5 rounded transition-colors text-sm"
                  :class="calendarViewMode === '4dias' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'"
                  @click="calendarViewMode = '4dias'"
                >
                  <span>4 dias</span>
                  <UKbd>4</UKbd>
                </button>
                <button 
                  class="flex items-center justify-between w-full px-2 py-1.5 rounded transition-colors text-sm"
                  :class="calendarViewMode === 'semana' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'"
                  @click="calendarViewMode = 'semana'"
                >
                  <span>Semana</span>
                  <UKbd>SEM</UKbd>
                </button>
                <button 
                  class="flex items-center justify-between w-full px-2 py-1.5 rounded transition-colors text-sm"
                  :class="calendarViewMode === 'mes' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'"
                  @click="calendarViewMode = 'mes'"
                >
                  <span>Mês</span>
                  <UKbd>MIN</UKbd>
                </button>
              </div>
            </template>
          </UPopover>
        </div>

        <!-- Navegação de Setas -->
        <div class="flex items-center gap-1">
          <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-left" class="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Mês anterior" @click="shiftCalendarMonth(-1)" />
          <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-right" class="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Próximo mês" @click="shiftCalendarMonth(1)" />
        </div>

        <!-- Rótulo do Mês -->
        <h2 class="font-display text-lg font-semibold text-slate-700 dark:text-slate-200 ml-2 capitalize">{{ calendarLabel.toLowerCase() }}</h2>
      </div>
      <CalendarioCalendarTimeGrid
        v-if="calendarViewMode !== 'mes'"
        :date="timeGridBaseDate"
        :days-count="calendarViewMode === 'dia' ? 1 : calendarViewMode === '4dias' ? 4 : 7"
        :events="calendarEvents"
        @add-task="newTaskOpen = true"
        @edit-task="openEditTaskModal(tasks.find(t => t.id === $event.id)!)"
      />
      <CalendarioCalendarMonth
        v-else
        :year="calendarCurrent.year"
        :month="calendarCurrent.month"
        :events="calendarEvents"
        @add-task="newTaskOpen = true"
        @edit-task="openEditTaskModal(tasks.find(t => t.id === $event.id)!)"
      />
    </div>

    <!-- Ações em massa: permanece disponível sem deslocar os filtros ou a tabela. -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="isSelecting"
        class="fixed inset-x-3 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl shadow-slate-900/15 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/30 sm:bottom-6"
      >
        <div class="flex items-center gap-2 px-2.5 py-1.5">
          <span class="flex size-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            {{ selectedTasks.length }}
          </span>
          <span class="hidden text-sm font-semibold text-slate-700 dark:text-slate-200 sm:inline">
            {{ selectedTasks.length === 1 ? 'selecionada' : 'selecionadas' }}
          </span>
        </div>
        <template v-if="activeMainTab === 'pessoais'">
          <div class="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <UPopover v-model:open="bulkStatusOpen">
            <UButton size="xs" color="neutral" variant="ghost" label="Selecionar status" :disabled="selectedTasks.length === 0" />
            <template #content>
              <div class="w-44 p-1.5">
                <p class="px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Alterar status</p>
                <button
                  v-for="status in personalStatusOptions"
                  :key="status"
                  type="button"
                  class="flex w-full items-center rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
                  @click="bulkStatus(status)"
                >
                  {{ useStatusMeta(status).label }}
                </button>
              </div>
            </template>
          </UPopover>
          <UPopover v-model:open="bulkPriorityOpen">
            <UButton size="xs" color="neutral" variant="ghost" label="Selecionar prioridade" :disabled="selectedTasks.length === 0" />
            <template #content>
              <div class="w-44 p-1.5">
                <p class="px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Alterar prioridade</p>
                <button
                  v-for="priority in priorityOptions"
                  :key="priority.value"
                  type="button"
                  class="flex w-full items-center rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
                  @click="bulkPriority(priority.value)"
                >
                  {{ priority.label }}
                </button>
              </div>
            </template>
          </UPopover>
          <div class="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <UButton
            size="xs"
            color="primary"
            icon="i-heroicons-arrow-down-tray"
            label="Exportar"
            :disabled="selectedTasks.length === 0"
            @click="exportSelectedPersonalTasks"
          />
          <UButton size="xs" color="neutral" variant="ghost" icon="i-heroicons-x-mark" aria-label="Cancelar seleção" @click="toggleSelectionMode" />
        </template>
        <UButton
          v-else
          size="xs"
          color="primary"
          icon="i-heroicons-arrow-down-tray"
          label="Exportar"
          :disabled="selectedTasks.length === 0"
          @click="exportSelectedWorkTasks"
        />
      </div>
    </Transition>

    <TarefasNewTaskModal v-model:open="newTaskOpen" @created="activeMainTab = 'pessoais'" />
    <TarefasEditTaskModal v-model:open="editTaskOpen" :task-to-edit="taskToEdit" @updated="editTaskOpen = false" />
  </div>
</template>
