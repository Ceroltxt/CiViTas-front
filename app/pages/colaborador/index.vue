<script setup lang="ts">
import { dueDateOrder } from '~/utils/date'
import type { TaskAuditEntry } from '~/types'

definePageMeta({ sidebarWidget: 'project' })

const user = useCurrentUser()

onMounted(() => {
  fetchTasksFromSupabase()
})
const teamDetails = useTeamsData()
const teamsModalOpen = ref(false)

// Filtro de período do Dashboard
const COSTA_ENTRY_DATE = '2026-06-01'
const todayISO = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
function daysBeforeToday(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const defaultDateFrom = daysBeforeToday(6)
const dateFrom = ref(defaultDateFrom)
const dateTo = ref(todayISO.value)

const calendarMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const dragAnchor = ref<string | null>(null)
const isDraggingCalendar = ref(false)
const didDragCalendar = ref(false)
const ignoreNextDateClick = ref(false)
const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })

function formatISODate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const calendarMonthLabel = computed(() => {
  const label = monthFormatter.format(calendarMonth.value)
  return label.charAt(0).toUpperCase() + label.slice(1)
})

const calendarDays = computed(() => {
  const firstDay = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const iso = formatISODate(date)
    return {
      iso,
      label: date.getDate(),
      currentMonth: date.getMonth() === calendarMonth.value.getMonth(),
      disabled: iso < COSTA_ENTRY_DATE || iso > todayISO.value,
    }
  })
})

const canShowPreviousMonth = computed(() => {
  const previous = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() - 1, 1)
  return formatISODate(new Date(previous.getFullYear(), previous.getMonth() + 1, 0)) >= COSTA_ENTRY_DATE
})
const canShowNextMonth = computed(() => {
  const next = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + 1, 1)
  return formatISODate(next) <= todayISO.value
})

function changeCalendarMonth(offset: number) {
  if ((offset < 0 && !canShowPreviousMonth.value) || (offset > 0 && !canShowNextMonth.value)) return
  calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + offset, 1)
}

function selectCalendarDate(iso: string) {
  dateFrom.value = iso
  dateTo.value = iso
}

function updateCalendarRange(iso: string) {
  if (!dragAnchor.value) return
  dateFrom.value = iso < dragAnchor.value ? iso : dragAnchor.value
  dateTo.value = iso > dragAnchor.value ? iso : dragAnchor.value
}

function beginCalendarSelection(iso: string, event: PointerEvent) {
  event.preventDefault()
  dragAnchor.value = iso
  isDraggingCalendar.value = true
  didDragCalendar.value = false
  selectCalendarDate(iso)
}

function extendCalendarSelection(event: PointerEvent) {
  if (!isDraggingCalendar.value) return
  const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
  const cell = target?.closest<HTMLButtonElement>('[data-calendar-date]')
  const iso = cell?.dataset.calendarDate
  if (!iso || cell.disabled) return
  if (iso !== dragAnchor.value) didDragCalendar.value = true
  updateCalendarRange(iso)
}

function endCalendarSelection() {
  if (!isDraggingCalendar.value) return
  ignoreNextDateClick.value = didDragCalendar.value
  isDraggingCalendar.value = false
  dragAnchor.value = null
}

function handleCalendarDateClick(iso: string) {
  if (ignoreNextDateClick.value) {
    ignoreNextDateClick.value = false
    return
  }
  selectCalendarDate(iso)
}

function isSelectedCalendarDate(iso: string) {
  return iso >= dateFrom.value && iso <= dateTo.value
}

onMounted(() => window.addEventListener('pointerup', endCalendarSelection))
onBeforeUnmount(() => window.removeEventListener('pointerup', endCalendarSelection))

const dateLabel = computed(() => {
  if (dateFrom.value === defaultDateFrom && dateTo.value === todayISO.value) {
    return 'Últimos 7 dias'
  }
  if (dateFrom.value === todayISO.value && dateTo.value === todayISO.value) {
    return 'Hoje'
  }
  const format = (iso: string) => iso.split('-').reverse().join('/')
  const f = format(dateFrom.value)
  const t = format(dateTo.value)
  if (f === t) return f
  return `De ${f} até ${t}`
})

watch(dateFrom, (v) => {
  if (v > dateTo.value) dateTo.value = v
  if (v < COSTA_ENTRY_DATE) dateFrom.value = COSTA_ENTRY_DATE
})

watch(dateTo, (v) => {
  if (v > todayISO.value) dateTo.value = todayISO.value
  if (v < dateFrom.value) dateFrom.value = v
})

const { filteredTasks: dashboardTasks } = useDashboardStats(dateFrom, dateTo, computed(() => user.id))

function parseFullDate(value?: string): Date | null {
  if (!value) return null
  const [day, month, year] = value.split('/').map(Number)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

function parseDueDate(value?: string, year = 2026): Date | null {
  if (!value) return null
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const [dayText, monthText] = value.split(' ')
  const month = months.findIndex((item) => item.toLowerCase() === monthText?.slice(0, 3).toLowerCase())
  const day = Number(dayText)
  return Number.isInteger(day) && month >= 0 ? new Date(year, month, day) : null
}

const performanceMetrics = computed(() => {
  const tasks = dashboardTasks.value
  const completed = tasks.filter((task) => task.status === 'concluido')
  const durations = completed.flatMap((task) => {
    const start = parseFullDate(task.startDate)
    const end = parseFullDate(task.completedDate)
    return start && end ? [(end.getTime() - start.getTime()) / 86_400_000] : []
  })
  const averageDays = durations.length ? durations.reduce((sum, value) => sum + value, 0) / durations.length : 0
  const withDueDate = completed.flatMap((task) => {
    const completedDate = parseFullDate(task.completedDate)
    const dueDate = parseDueDate(task.dueDate, completedDate?.getFullYear())
    return completedDate && dueDate ? [completedDate <= dueDate] : []
  })
  const completionRate = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0
  const onTimeRate = withDueDate.length ? Math.round((withDueDate.filter(Boolean).length / withDueDate.length) * 100) : 0

  return [
    { label: 'Tarefas totais', value: String(tasks.length), icon: 'i-heroicons-clipboard-document-list', bgClass: 'bg-gradient-to-br from-blue-500 to-sky-600' },
    { label: 'Tempo médio de conclusão', value: `${averageDays.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} dias`, icon: 'i-heroicons-clock', bgClass: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { label: 'Taxa de conclusão', value: `${completionRate}%`, icon: 'i-heroicons-check-circle', bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600' },
    { label: 'No prazo', value: `${onTimeRate}%`, icon: 'i-heroicons-calendar-days', bgClass: 'bg-gradient-to-br from-pink-500 to-rose-500' },
  ]
})

const dashboardStatusRows = computed(() => {
  const statuses = [
    { label: 'A fazer', matches: ['a-fazer'] },
    { label: 'Em andamento', matches: ['em-andamento'] },
    { label: 'Em revisão', matches: ['em-revisao'] },
    { label: 'A validar', matches: ['validar'] },
    { label: 'Concluídas', matches: ['concluido'] },
    { label: 'Atrasadas', matches: ['atrasado'] },
    { label: 'Pausadas/canceladas', matches: ['pausado', 'cancelado'] },
  ]
  return statuses.map(({ label, matches }) => ({
    label,
    value: dashboardTasks.value.filter((task) => matches.includes(task.status)).length,
  }))
})

const completedByWeekday = computed(() => {
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const counts = Array.from({ length: 7 }, () => 0)
  let datedCompleted = 0

  dashboardTasks.value.forEach((task) => {
    if (task.status !== 'concluido' || !task.completedDate) return
    const completed = parseFullDate(task.completedDate)
    if (!completed) return
    counts[(completed.getDay() + 6) % 7]++
    datedCompleted++
  })

  counts[6] += dashboardTasks.value.filter((task) => task.status === 'concluido').length - datedCompleted
  return labels.map((label, index) => ({ label, value: counts[index] }))
})

function escapeCSV(value: string | number) {
  const text = String(value)
  return /[;"\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function exportDashboardCSV() {
  const rows: Array<Array<string | number>> = [
    ['PAINEL DE ATIVIDADES', dateLabel.value],
    [],
    ['INDICADORES'],
    ['Indicador', 'Valor'],
    ...performanceMetrics.value.map((metric) => [metric.label, metric.value]),
    [],
    ['TAREFAS POR STATUS'],
    ['Status', 'Quantidade'],
    ...dashboardStatusRows.value.map((status) => [status.label, status.value]),
    [],
    ['TAREFAS CONCLUÍDAS POR DIA DA SEMANA'],
    ['Dia', 'Quantidade'],
    ...completedByWeekday.value.map((day) => [day.label, day.value]),
  ]

  const csv = `\uFEFF${rows.map((row) => row.map(escapeCSV).join(';')).join('\r\n')}`
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = `painel-de-atividades-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function resetFilter() {
  dateFrom.value = defaultDateFrom
  dateTo.value = todayISO.value
}

// Tarefas a fazer para o resumo da home
const allTasks = useTasksData()
const myTasks = computed(() => allTasks.filter((task) => task.personal || task.assignees.some((assignee) => assignee.id === user.id)))
const taskOverviewFilter = ref<'todas' | 'a-fazer' | 'em-andamento' | 'em-revisao' | 'validar' | 'atrasadas' | 'concluidas' | 'pausado'>('todas')
const taskOverviewTabs = [
  { id: 'todas', label: 'Todas' },
  { id: 'a-fazer', label: 'A fazer' },
  { id: 'em-andamento', label: 'Em andamento' },
  { id: 'em-revisao', label: 'Em revisão' },
  { id: 'validar', label: 'A validar' },
  { id: 'atrasadas', label: 'Atrasadas' },
  { id: 'concluidas', label: 'Concluídas' },
  { id: 'pausado', label: 'Pausadas' },
] as const

const overviewTasks = computed(() => {
  const status = taskOverviewFilter.value
  const tasks = myTasks.value.filter((task) => {
    if (status === 'todas') return true
    if (status === 'atrasadas') return task.status === 'atrasado'
    if (status === 'concluidas') return task.status === 'concluido'
    return task.status === status
  })
  return [...tasks].sort((a, b) => dueDateOrder(a.dueDate) - dueDateOrder(b.dueDate)).slice(0, 5)
})

const recentActivities = computed<TaskAuditEntry[]>(() => {
  const history = myTasks.value
    .flatMap((task) => task.auditLog ?? [])
    .sort((a, b) => b.id.localeCompare(a.id))

  const missing = Math.max(0, 8 - history.length)
  const createdActivities = myTasks.value
    .filter((task) => !task.auditLog?.length)
    .slice(0, missing)
    .map((task, index) => ({
      id: `home-created-${task.id}`,
      icon: index % 3 === 0 ? 'i-heroicons-clipboard-document-list' : index % 3 === 1 ? 'i-heroicons-arrow-path' : 'i-heroicons-play',
      message: index % 3 === 0
        ? `Tarefa “${task.title}” adicionada à sua lista`
        : index % 3 === 1
          ? `Você atualizou “${task.title}”`
          : `Você iniciou “${task.title}”`,
      user: user.name,
      timestamp: task.startDate || `${String(index + 1).padStart(2, '0')}/06/2026 às 09:00`,
    }))

  return [...history, ...createdActivities].slice(0, 8)
})

function openTask(taskId: string) {
  navigateTo(`/colaborador/tarefa/${taskId}`)
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <!-- Saudação + Filtro de Período -->
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Início</h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Acompanhe suas tarefas, resultados e próximos passos.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          color="white"
          icon="i-heroicons-arrow-down-tray"
          label="Exportar"
          class="border border-transparent shadow-sm font-medium text-slate-700 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-200 dark:hover:border-violet-800 dark:hover:bg-violet-950/30 dark:hover:text-violet-200"
          @click="exportDashboardCSV"
        />
        <UPopover :popper="{ placement: 'bottom-end' }">
          <UButton
            color="white"
            icon="i-heroicons-calendar-days"
            :label="dateLabel"
            class="shadow-sm font-medium text-slate-700 dark:text-slate-200 min-w-32 justify-between"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
          <template #content>
            <div class="w-[20rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div class="border-b border-slate-100 px-4 pb-3 pt-4 dark:border-slate-800">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Filtrar atividades</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Clique em um dia ou arraste até a data final desejada.</p>
              </div>

              <div
                class="select-none p-3 touch-none"
                @pointermove="extendCalendarSelection"
                @pointerup="endCalendarSelection"
              >
                <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <div class="mb-3 flex items-center justify-between px-0.5">
                    <button
                      type="button"
                      aria-label="Mês anterior"
                      class="grid size-7 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                      :disabled="!canShowPreviousMonth"
                      @click="changeCalendarMonth(-1)"
                    >
                      <UIcon name="i-heroicons-chevron-left" class="size-4" />
                    </button>
                    <span class="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">{{ calendarMonthLabel }}</span>
                    <button
                      type="button"
                      aria-label="Próximo mês"
                      class="grid size-7 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                      :disabled="!canShowNextMonth"
                      @click="changeCalendarMonth(1)"
                    >
                      <UIcon name="i-heroicons-chevron-right" class="size-4" />
                    </button>
                  </div>

                  <div class="grid grid-cols-7 gap-y-1 text-center">
                    <span v-for="(weekday, index) in weekDays" :key="index" class="pb-1 text-[10px] font-bold text-slate-400">{{ weekday }}</span>
                    <button
                      v-for="day in calendarDays"
                      :key="day.iso"
                      type="button"
                      :data-calendar-date="day.iso"
                      :disabled="day.disabled"
                      class="relative mx-auto grid size-8 place-items-center rounded-lg text-xs font-medium transition-colors disabled:cursor-not-allowed"
                      :class="[
                        day.disabled ? 'text-slate-300 dark:text-slate-600' : day.currentMonth ? 'text-slate-700 hover:bg-violet-100 dark:text-slate-200 dark:hover:bg-violet-900/40' : 'text-slate-400 hover:bg-violet-100 dark:text-slate-500',
                        isSelectedCalendarDate(day.iso) && !day.disabled ? 'bg-violet-600 text-white hover:bg-violet-600 dark:text-white dark:hover:bg-violet-600' : '',
                      ]"
                      @pointerdown="beginCalendarSelection(day.iso, $event)"
                      @click="handleCalendarDateClick(day.iso)"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="mx-4 mb-4 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2.5 dark:border-violet-900/50 dark:bg-violet-950/30">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Período selecionado</span>
                  <span class="truncate text-xs font-semibold text-violet-700 dark:text-violet-300">{{ dateLabel }}</span>
                </div>
                <button
                  type="button"
                  class="mt-2 flex items-center gap-1 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-100"
                  @click="resetFilter"
                >
                  <UIcon name="i-heroicons-arrow-path" class="size-3.5" />
                  Limpar filtro
                </button>
              </div>
            </div>
          </template>
        </UPopover>
      </div>
    </div>

    <!-- Indicadores de desempenho -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InicioStatCard
        v-for="metric in performanceMetrics"
        :key="metric.label"
        v-bind="metric"
        icon-class="text-white"
      />
    </div>

    <!-- Indicadores de tarefas -->
    <div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <InicioTaskStatusChart :tasks="dashboardTasks" />
      <InicioCompletedTasksChart :tasks="dashboardTasks" />
    </div>

    <!-- Tarefas do colaborador -->
    <UiSectionCard class="overflow-hidden">
      <template #header>
        <div class="w-full">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas mais importantes</h2>
              <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><UIcon name="i-heroicons-calendar-days" class="size-3.5" /> Ordenado por prazo</p>
            </div>
            <UButton to="/colaborador/minhas-tarefas" variant="link" trailing-icon="i-heroicons-arrow-right" label="Ver todas as tarefas" class="!p-0 text-indigo-500" />
          </div>
          <div class="mt-4 flex gap-1.5 overflow-x-auto pb-0.5">
            <button
              v-for="tab in taskOverviewTabs"
              :key="tab.id"
              type="button"
              class="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="taskOverviewFilter === tab.id ? 'border-[#b64fc2] bg-[#bd52c9] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'"
              @click="taskOverviewFilter = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </template>

      <div class="-mx-5 -mb-5 mt-1 overflow-x-auto sm:-mx-6 sm:-mb-6">
        <table class="w-full min-w-[650px] text-left">
          <thead class="border-y border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
            <tr><th class="px-5 py-3">Tarefa</th><th class="px-4 py-3">Projeto</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Prioridade</th><th class="px-5 py-3">Prazo</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="task in overviewTasks"
              :key="task.id"
              class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-violet-50/40 dark:border-slate-800 dark:hover:bg-violet-950/15"
              @click="openTask(task.id)"
            >
              <td class="max-w-72 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200"><span class="line-clamp-2">{{ task.title }}</span></td>
              <td class="px-4 py-3 text-sm text-slate-500"><span class="flex items-center gap-2"><span class="size-2 rounded-full" :class="useProjectDotColor(task.project)" />{{ task.project || 'Tarefa pessoal' }}</span></td>
              <td class="px-4 py-3"><UiStatusBadge :status="task.status" /></td>
              <td class="px-4 py-3 text-sm font-medium" :class="usePriorityMeta(task.priority).text">{{ usePriorityMeta(task.priority).label }}</td>
              <td class="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">{{ task.dueDate || '-' }}</td>
            </tr>
            <tr v-if="overviewTasks.length === 0"><td colspan="5" class="px-5 py-10 text-center text-sm text-slate-400">Nenhuma tarefa encontrada.</td></tr>
          </tbody>
        </table>
      </div>
    </UiSectionCard>

    <!-- Projetos e atividade recente -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <UiSectionCard title="Projetos">
        <template #action>
          <UButton variant="link" trailing-icon="i-heroicons-arrow-right" label="Ver Todos" class="!p-0 text-indigo-500" @click="teamsModalOpen = true" />
        </template>
        <InicioProjectTeamsCard :team-details="teamDetails" />
      </UiSectionCard>
      <InicioRecentActivityCard :entries="recentActivities" />
    </div>

    <InicioTeamsModal v-model:open="teamsModalOpen" :teams="teamDetails" />
  </div>
</template>
