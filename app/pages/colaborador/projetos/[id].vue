<script setup lang="ts">
import type { CalendarEvent, PriorityKey, StatusKey, Task } from '~/types'
import { MONTHS_SHORT, formatMonthLabel } from '~/utils/date'
definePageMeta({ sidebarWidget: 'project' })
const route = useRoute()
const project = computed(() => useUserProjects().find(item => item.id === route.params.id))
const tasks = useTasksRef()
const activeView = ref<'lista' | 'kanban' | 'gantt' | 'calendario'>('lista')
const search = ref('')
const statuses = ref<StatusKey[]>([])
const priorities = ref<PriorityKey[]>([])
const calendar = ref({ year: 2026, month: 7 })
if (!project.value) await navigateTo('/colaborador/projetos')
const descriptions: Record<string, string> = { p1: 'Revitalização e acompanhamento das entregas da praça central.', p2: 'Planejamento das manutenções preventivas da frota municipal.', p3: 'Revisão técnica e documental dos processos de licitação.', p4: 'Evolução dos serviços digitais voltados ao cidadão.', p5: 'Organização, análise e aprovação de alvarás.', p6: 'Acompanhamento de melhorias na infraestrutura urbana.' }
const projectStatuses: Record<string, string> = { p1: 'Ativo', p2: 'Planejamento', p3: 'Concluído', p4: 'Pausado', p5: 'Cancelado', p6: 'Ativo' }
const projectTasks = computed<Task[]>(() => tasks.value.filter(task => !task.personal && task.project === project.value?.name))
const filtered = computed(() => projectTasks.value.filter(task => (!search.value || task.title.toLowerCase().includes(search.value.toLowerCase())) && (!statuses.value.length || statuses.value.includes(task.status)) && (!priorities.value.length || priorities.value.includes(task.priority))))
const done = computed(() => projectTasks.value.filter(task => task.status === 'concluido').length)
const progress = computed(() => projectTasks.value.filter(task => task.status === 'em-andamento').length)
const delayed = computed(() => projectTasks.value.filter(task => task.status === 'atrasado').length)
const views = [{ id: 'lista', label: 'Lista', icon: 'i-heroicons-list-bullet' }, { id: 'kanban', label: 'Kanban', icon: 'i-heroicons-squares-2x2' }, { id: 'gantt', label: 'Gantt', icon: 'i-heroicons-bars-3-bottom-left' }, { id: 'calendario', label: 'Calendário', icon: 'i-heroicons-calendar-days' }] as const
const events = computed<CalendarEvent[]>(() => filtered.value.flatMap(task => {
 if (!task.dueDate) return []
 const [day, monthText] = task.dueDate.split(' ')
 if (MONTHS_SHORT.findIndex(item => item.toLowerCase() === monthText?.slice(0, 3).toLowerCase()) !== calendar.value.month) return []
 const colors: Record<PriorityKey, CalendarEvent['color']> = { critica: 'pink', alta: 'violet', media: 'blue', baixa: 'green' }
 return [{ id: task.id, title: task.title, startDay: Number(day), length: 1, color: colors[task.priority] }]
}))
function toggleStatus(status: StatusKey) { statuses.value = statuses.value.includes(status) ? statuses.value.filter(item => item !== status) : [...statuses.value, status] }
function togglePriority(priority: PriorityKey) { priorities.value = priorities.value.includes(priority) ? priorities.value.filter(item => item !== priority) : [...priorities.value, priority] }
function shiftMonth(offset: number) { const date = new Date(calendar.value.year, calendar.value.month + offset, 1); calendar.value = { year: date.getFullYear(), month: date.getMonth() } }
function projectTone(color: string) {
  const tones: Record<string, { surface: string, text: string, border: string }> = {
    'bg-blue-500': { surface: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-400' },
    'bg-violet-500': { surface: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-400' },
    'bg-amber-400': { surface: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-400' },
    'bg-pink-500': { surface: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-400' },
    'bg-cyan-500': { surface: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-400' },
    'bg-indigo-500': { surface: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-400' },
  }
  return tones[color] ?? { surface: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-500', border: 'border-slate-400' }
}
</script>

<template>
 <div v-if="project" class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
  <UButton to="/colaborador/projetos" color="neutral" variant="link" icon="i-heroicons-arrow-left" label="Voltar para projetos" class="!p-0 text-slate-500" />
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
   <div class="flex flex-col gap-5 lg:flex-row lg:justify-between">
    <div class="flex gap-4"><span class="grid size-13 shrink-0 place-items-center rounded-2xl" :class="[projectTone(project.color).surface, projectTone(project.color).text]"><UIcon name="i-heroicons-folder" class="size-6" /></span><div><div class="flex gap-2"><span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{{ projectStatuses[project.id] }}</span><span class="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">Alto impacto</span></div><h1 class="mt-2 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">{{ project.name }}</h1><p class="mt-1 text-sm text-slate-500">{{ descriptions[project.id] }}</p></div></div>
    <div class="grid size-20 place-items-center rounded-full border-[6px] text-xl font-bold text-slate-800 dark:text-slate-100" :class="projectTone(project.color).border">{{ project.progress }}%</div>
   </div>
   <div class="mt-5 grid gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3"><p class="flex gap-2 text-slate-500"><UIcon name="i-heroicons-user-circle" class="size-5" /><span><small class="block text-xs text-slate-400">Responsável</small><strong class="text-slate-700 dark:text-slate-200">Macena Souza</strong></span></p><p class="flex gap-2 text-slate-500"><UIcon name="i-heroicons-calendar-days" class="size-5" /><span><small class="block text-xs text-slate-400">Prazo</small><strong class="text-slate-700 dark:text-slate-200">30/08/2026</strong></span></p><p class="flex gap-2 text-slate-500"><UIcon name="i-heroicons-bullseye" class="size-5" /><span><small class="block text-xs text-slate-400">Meta</small><strong class="text-slate-700 dark:text-slate-200">Concluir entregas prioritárias no prazo.</strong></span></p></div>
  </section>
  <div class="grid grid-cols-2 gap-3 lg:grid-cols-4"><div v-for="stat in [{ label: 'Total', value: projectTasks.length, icon: 'i-heroicons-chart-bar' }, { label: 'Concluídas', value: done, icon: 'i-heroicons-check-circle' }, { label: 'Em andamento', value: progress, icon: 'i-heroicons-clock' }, { label: 'Atrasadas', value: delayed, icon: 'i-heroicons-exclamation-triangle' }]" :key="stat.label" class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-lg bg-orange-50 text-orange-600"><UIcon :name="stat.icon" class="size-4" /></span><div><p class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ stat.value }}</p><p class="text-xs text-slate-500">{{ stat.label }}</p></div></div></div></div>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
   <div class="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between"><h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas do projeto</h2><div class="flex gap-1 overflow-x-auto"><button v-for="view in views" :key="view.id" type="button" class="relative flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-semibold after:absolute after:bottom-0 after:inset-x-3 after:h-0.5" :class="activeView === view.id ? 'text-orange-600 after:bg-orange-500' : 'text-slate-400 hover:text-slate-600'" @click="activeView = view.id"><UIcon :name="view.icon" class="size-4" />{{ view.label }}</button></div></div>
   <div class="space-y-3 p-4"><div class="flex flex-wrap gap-2"><UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar tarefas" class="w-full sm:w-56" /><UPopover><UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-list-bullet" :label="statuses.length ? String(statuses.length) + ' status' : 'Status: todos'" /><template #content><div class="w-56 p-2"><button v-for="status in useStatusOptions()" :key="status.value" class="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-slate-50" @click="toggleStatus(status.value)"><span>{{ status.label }}</span><UIcon v-if="statuses.includes(status.value)" name="i-heroicons-check" class="size-4 text-orange-500" /></button></div></template></UPopover><UPopover><UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-flag" :label="priorities.length ? String(priorities.length) + ' prioridades' : 'Prioridade: todas'" /><template #content><div class="w-52 p-2"><button v-for="priority in usePriorityOptions()" :key="priority.value" class="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-slate-50" @click="togglePriority(priority.value)"><span>{{ priority.label }}</span><UIcon v-if="priorities.includes(priority.value)" name="i-heroicons-check" class="size-4 text-orange-500" /></button></div></template></UPopover></div>
    <TarefasTaskTable v-if="activeView === 'lista' && filtered.length" :tasks="filtered" />
    <div v-else-if="activeView === 'lista'" class="py-12 text-center text-sm text-slate-400">Nenhuma tarefa encontrada.</div>
    <QuadrosKanbanBoard v-else-if="activeView === 'kanban'" :tasks="filtered" all-status />
    <QuadrosGanttChart v-else-if="activeView === 'gantt'" :tasks="filtered" />
    <div v-else class="space-y-3"><div class="flex items-center justify-between"><h3 class="font-semibold text-slate-700">{{ formatMonthLabel(calendar.year, calendar.month) }}</h3><div class="flex gap-1"><UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-left" @click="shiftMonth(-1)" /><UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-right" @click="shiftMonth(1)" /></div></div><CalendarioCalendarMonth :year="calendar.year" :month="calendar.month" :events="events" /></div>
   </div>
  </section>
 </div>
</template>
