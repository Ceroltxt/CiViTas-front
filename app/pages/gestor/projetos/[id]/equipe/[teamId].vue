<script setup lang="ts">
import type { ProjectTeam, ProjectProgress, Task, UserSummary } from '~/types'
import { addTask } from '~/composables/useTasksData'
definePageMeta({ sidebarWidget: 'project' })

const route = useRoute()
const projectId = route.params.id as string
const teamId = route.params.teamId as string

const projects = useUserProjects()
const project = computed<ProjectProgress | undefined>(() => projects.find(p => p.id === projectId))
const team = computed<ProjectTeam | undefined>(() => project.value?.teams?.find(t => t.id === teamId))

if (!team.value || !project.value) await navigateTo(`/gestor/projetos/${projectId}`)

const activeTab = ref<'visao-geral' | 'tarefas' | 'membros' | 'atividade'>('visao-geral')

const tabs = [
  { id: 'visao-geral', label: 'Visão geral', icon: 'i-heroicons-squares-2x2' },
  { id: 'tarefas', label: 'Tarefas', icon: 'i-heroicons-clipboard-document-list' },
  { id: 'membros', label: 'Membros', icon: 'i-heroicons-user-group' },
  { id: 'atividade', label: 'Atividade', icon: 'i-heroicons-clock' },
] as const

// Mock members for this team
const teamMembers = computed<UserSummary[]>(() => {
  if (team.value?.name === 'Planejamento e Orçamento') {
    const map = new Map<string, UserSummary>()
    map.set('u-costa', { id: 'u-costa', name: 'Costa Neves', role: 'Colaborador', avatar: 'https://i.pravatar.cc/80?img=47' })
    map.set('u-gestor', { id: 'u-gestor', name: 'Milani Ribeiro', role: 'Líder de equipe', avatar: 'https://i.pravatar.cc/80?img=44' })

    allTasks.value.forEach(t => {
      if (!t.personal && t.project === project.value?.name && t.assignees) {
        t.assignees.forEach(a => {
          if (!map.has(a.id)) {
            map.set(a.id, { ...a, role: 'Colaborador' })
          }
        })
      }
    })
    return Array.from(map.values())
  }

  const count = team.value?.memberCount ?? 3
  const names = ['João Pedro', 'Ana Clara', 'Rafael Lima', 'Beatriz Ribeiro', 'Costa Neves', 'Marina Costa', 'Carlos Mendes']
  const knownUsers: Record<string, Pick<UserSummary, 'id' | 'avatar'>> = {
    'Costa Neves': { id: 'u-costa', avatar: 'https://i.pravatar.cc/80?img=47' },
  }
  return Array.from({ length: Math.min(count, names.length) }, (_, i) => ({
    id: knownUsers[names[i]]?.id ?? `tm${i}`,
    name: names[i],
    role: i === 0 ? 'Líder de equipe' : 'Colaborador',
    avatar: knownUsers[names[i]]?.avatar ?? `https://i.pravatar.cc/48?img=${30 + i}`,
  }))
})

// Tasks: reuse project tasks but label them under team name
const allTasks = useTasksRef()
const teamTasks = computed<Task[]>(() => {
  const filtered = allTasks.value.filter(t => !t.personal && t.project === project.value?.name)
  if (team.value?.name === 'Planejamento e Orçamento') return filtered
  return filtered.slice(0, team.value?.memberCount ? team.value.memberCount + 2 : 5)
})

import { useTeamActivity } from '~/composables/useTeamActivity'
const realActivities = useTeamActivity(project.value?.name || '')

// Mock activities
const activities = computed(() => {
  if (team.value?.name === 'Planejamento e Orçamento') return realActivities.value as any[]
  
  return [
    { id: 'a1', user: 'João Pedro', action: 'atualizou o status da tarefa', detail: 'Verificar instalações hidráulicas', time: '2h atrás' },
    { id: 'a2', user: 'Ana Clara', action: 'enviou um novo arquivo', detail: 'Planta elétrica - revisão 02.pdf', time: '5h atrás' },
    { id: 'a3', user: 'Rafael Lima', action: 'comentou na tarefa', detail: 'Fiscalizar obra da Nova Praça Central', time: '1 dia atrás' },
    { id: 'a4', user: 'Macena Souza', action: 'criou a tarefa', detail: 'Revisar cronograma de execução', time: '2 dias atrás' },
    { id: 'a5', user: 'Costa Neves', action: 'concluiu a tarefa', detail: 'Levantar materiais para fundação', time: '3 dias atrás' },
    { id: 'a6', user: 'Ana Clara', action: 'adicionou um membro', detail: 'Carlos Mendes entrou na equipe', time: '4 dias atrás' },
  ]
})

// Progress stats
const totalTasks = computed(() => teamTasks.value.length)
const doneTasks = computed(() => teamTasks.value.filter(t => t.status === 'concluido').length)
const inProgress = computed(() => teamTasks.value.filter(t => t.status === 'em-andamento').length)
const delayedTasks = computed(() => teamTasks.value.filter(t => t.status === 'atrasado').length)
const progressPercent = computed(() => totalTasks.value ? Math.round((doneTasks.value / totalTasks.value) * 100) : 0)

const priorityColorMap: Record<string, string> = {
  'Alta': 'text-red-600 bg-red-50',
  'Média': 'text-amber-600 bg-amber-50',
  'Baixa': 'text-green-600 bg-green-50',
  'Crítica': 'text-pink-600 bg-pink-50',
}

const selectedTask = ref<Task | null>(null)
const taskPanelOpen = ref(false)
const createTaskOpen = ref(false)
const newTask = reactive({ title: '', description: '', assigneeId: '', priority: 'media', deadline: '', subtask: '' })
const newSubtasks = ref<string[]>([])
const memberSearch = ref('')
const availableAssignees = computed(() => teamMembers.value.filter(member => member.name.toLowerCase().includes(memberSearch.value.toLowerCase())))

function openTask(task: Task) {
  selectedTask.value = task
  taskPanelOpen.value = true
}

function addNewSubtask() {
  const title = newTask.subtask.trim()
  if (title) newSubtasks.value.push(title)
  newTask.subtask = ''
}

function createTeamTask() {
  if (!newTask.title.trim() || !newTask.deadline || !team.value || !project.value) return
  const assignee = teamMembers.value.find(member => member.id === newTask.assigneeId)
  const id = `gt-${Date.now()}`
  addTask({
    id,
    title: newTask.title.trim(),
    description: newTask.description.trim(),
    priority: newTask.priority as Task['priority'],
    status: 'a-fazer',
    project: project.value.name,
    team: team.value.name,
    dueDate: new Date(`${newTask.deadline}T12:00:00`).toLocaleDateString('pt-BR'),
    assignees: assignee ? [assignee] : [],
    subtasks: newSubtasks.value.map((title, index) => ({ id: `${id}-st-${index}`, title, completed: false })),
    auditLog: [
      {
        id: `al-${Date.now()}`,
        icon: 'i-heroicons-clipboard-document-list',
        message: `Milani Ribeiro criou a tarefa e atribuiu a ${assignee?.name || 'Ninguém'}`,
        user: 'Gestor',
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')
      }
    ]
  })
  Object.assign(newTask, { title: '', description: '', assigneeId: '', priority: 'media', deadline: '', subtask: '' })
  memberSearch.value = ''
  newSubtasks.value = []
  createTaskOpen.value = false
}

const memberModalOpen = ref(false)
const selectedMember = ref<UserSummary | null>(null)

function openMemberModal(member: UserSummary) {
  selectedMember.value = member
  memberModalOpen.value = true
}

const memberTasks = computed(() => {
  if (!selectedMember.value) return []
  return teamTasks.value.filter(t => t.assignees?.some(a => a.id === selectedMember.value!.id))
})

const memberStats = computed(() => {
  const t = memberTasks.value
  return {
    total: t.length,
    concluidas: t.filter(x => x.status === 'concluido').length,
    andamento: t.filter(x => x.status === 'em-andamento').length,
    atrasadas: t.filter(x => x.status === 'atrasado').length,
    validar: t.filter(x => x.status === 'validar').length,
  }
})

function assignTaskToSelectedMember() {
  if (!selectedMember.value) return
  newTask.assigneeId = selectedMember.value.id
  createTaskOpen.value = true
  memberModalOpen.value = false
}
</script>

<template>
 <div v-if="team && project" class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
  <!-- Breadcrumb -->
  <nav class="flex items-center gap-1.5 text-sm text-slate-400">
   <NuxtLink to="/gestor/projetos" class="hover:text-slate-600">Projetos</NuxtLink>
   <UIcon name="i-heroicons-chevron-right" class="size-3" />
   <NuxtLink :to="`/gestor/projetos/${project.id}`" class="hover:text-slate-600">{{ project.name }}</NuxtLink>
   <UIcon name="i-heroicons-chevron-right" class="size-3" />
   <span class="text-slate-600 font-medium">{{ team.name }}</span>
  </nav>

  <!-- Header compacto -->
  <section class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
   <span class="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white" :class="team.color">
    {{ team.initial }}
   </span>
   <div class="min-w-0 flex-1">
    <div class="flex items-center gap-2">
     <h1 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{{ team.name }}</h1>
     <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ team.role }}</span>
    </div>
    <p class="text-xs text-slate-400">
     <UIcon name="i-heroicons-folder" class="inline size-3" />
     Projeto: <NuxtLink :to="`/gestor/projetos/${project.id}`" class="text-orange-500 hover:underline">{{ project.name }}</NuxtLink>
    </p>
   </div>
   <div class="flex items-center gap-6 text-sm text-slate-500">
    <div class="flex items-center gap-2"><UIcon name="i-heroicons-user-group" class="size-4" /><span class="font-bold text-slate-700 dark:text-slate-200">{{ team.memberCount }}</span> Membros</div>
    <div class="flex items-center gap-2"><UIcon name="i-heroicons-clipboard-document-list" class="size-4" /><span class="font-bold text-slate-700 dark:text-slate-200">{{ totalTasks }}</span> Tarefas</div>
   </div>
  </section>

  <!-- Abas -->
  <div class="flex gap-1 border-b border-slate-200 dark:border-slate-700">
   <button
    v-for="tab in tabs"
    :key="tab.id"
    type="button"
    class="relative flex items-center gap-1.5 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors"
    :class="activeTab === tab.id
      ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800'"
    @click="activeTab = tab.id"
   >
    <UIcon :name="tab.icon" class="size-4" />
    {{ tab.label }}
    <span v-if="activeTab === tab.id" class="absolute bottom-0 inset-x-0 h-0.5 bg-orange-500 rounded-full" />
   </button>
  </div>

  <!-- VISÃO GERAL -->
  <template v-if="activeTab === 'visao-geral'">
   <div class="grid gap-5 lg:grid-cols-2">
    <!-- Sobre a equipe -->
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
     <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Sobre a equipe</h2>
     <p class="text-sm text-slate-500 mb-4">{{ team.description }}</p>
     <div class="space-y-3 text-sm">
      <div class="flex items-center gap-3 text-slate-500">
       <UIcon name="i-heroicons-user-circle" class="size-4 text-slate-400" />
       <div><small class="text-xs text-slate-400">Líder</small><p class="font-medium text-slate-700 dark:text-slate-200">{{ team.leader }}</p></div>
      </div>
      <div class="flex items-center gap-3 text-slate-500">
       <UIcon name="i-heroicons-calendar-days" class="size-4 text-slate-400" />
       <div><small class="text-xs text-slate-400">Criada em</small><p class="font-medium text-slate-700 dark:text-slate-200">{{ team.createdAt }}</p></div>
      </div>
      <div class="flex items-center gap-3 text-slate-500">
       <UIcon name="i-heroicons-building-office" class="size-4 text-slate-400" />
       <div><small class="text-xs text-slate-400">Área / Departamento</small><p class="font-medium text-slate-700 dark:text-slate-200">{{ team.area }}</p></div>
      </div>
      <div class="flex items-center gap-3 text-slate-500">
       <UIcon name="i-heroicons-flag" class="size-4 text-slate-400" />
       <div><small class="text-xs text-slate-400">Prioridade da equipe</small><span class="inline-block rounded-full px-2 py-0.5 text-xs font-semibold" :class="priorityColorMap[team.priority ?? 'Média']">{{ team.priority }}</span></div>
      </div>
     </div>
    </section>

    <!-- Atividade recente -->
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
     <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Atividade recente</h2>
     <div class="space-y-4">
      <div v-for="act in activities.slice(0, 4)" :key="act.id" class="flex items-start gap-3">
       <div class="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-500/20">
        {{ act.user.split(' ').map((n: string) => n[0]).join('').substring(0, 2) }}
       </div>
       <div class="min-w-0 flex-1">
        <p class="text-sm text-slate-600 dark:text-slate-300"><strong class="text-slate-800 dark:text-slate-100">{{ act.user }}</strong> {{ act.action || act.message }}</p>
        <p class="text-xs text-slate-400 truncate">{{ act.detail || ('Tarefa: ' + act.taskTitle) }}</p>
       </div>
       <span class="shrink-0 text-xs text-slate-400">{{ act.time || act.timestamp }}</span>
      </div>
      <div v-if="activities.length === 0" class="text-sm text-slate-400 text-center py-4">Nenhuma atividade recente.</div>
     </div>
     <button type="button" class="mt-4 flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600" @click="activeTab = 'atividade'">
      Ver todas as atividades <UIcon name="i-heroicons-chevron-right" class="size-3.5" />
     </button>
    </section>
   </div>

   <!-- Progresso da equipe -->
   <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Progresso da equipe</h2>
    <div class="mb-4">
     <div class="flex items-center justify-between text-sm mb-1">
      <span class="text-slate-500">Conclusão geral</span>
      <span class="font-bold text-slate-700 dark:text-slate-200">{{ progressPercent }}%</span>
     </div>
     <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div class="h-full rounded-full bg-orange-500 transition-all" :style="{ width: `${progressPercent}%` }" />
     </div>
    </div>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
     <div v-for="stat in [
      { label: 'Total', value: totalTasks, icon: 'i-heroicons-chart-bar', color: 'text-slate-600 bg-slate-50' },
      { label: 'Concluídas', value: doneTasks, icon: 'i-heroicons-check-circle', color: 'text-emerald-600 bg-emerald-50' },
      { label: 'Em andamento', value: inProgress, icon: 'i-heroicons-clock', color: 'text-amber-600 bg-amber-50' },
      { label: 'Atrasadas', value: delayedTasks, icon: 'i-heroicons-exclamation-triangle', color: 'text-red-600 bg-red-50' },
     ]" :key="stat.label" class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <div class="flex items-center gap-3">
       <span class="grid size-9 place-items-center rounded-lg" :class="stat.color"><UIcon :name="stat.icon" class="size-4" /></span>
       <div><p class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ stat.value }}</p><p class="text-xs text-slate-500">{{ stat.label }}</p></div>
      </div>
     </div>
    </div>
   </section>
  </template>

  <!-- TAREFAS -->
  <template v-if="activeTab === 'tarefas'">
   <section class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
     <div><h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas da equipe</h2><p class="text-xs text-slate-400">Acompanhe e distribua as atividades.</p></div>
     <UButton icon="i-heroicons-plus" size="sm" class="bg-orange-500 hover:bg-orange-600" @click="createTaskOpen = true">Criar tarefa</UButton>
    </div>
    <div class="p-4">
     <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table class="w-full text-left">
       <thead>
        <tr class="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900/50">
         <th class="px-4 py-3">Tarefa</th>
         <th class="px-4 py-3">Equipe</th>
         <th class="px-4 py-3">Status</th>
         <th class="px-4 py-3">Prioridade</th>
         <th class="px-4 py-3">Responsável</th>
         <th class="px-4 py-3">Prazo</th>
         <th class="px-4 py-3 text-right text-amber-500">★</th>
        </tr>
       </thead>
       <tbody>
        <tr
         v-for="task in teamTasks"
         :key="task.id"
         :class="[
           task.status === 'validar' ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/50 dark:hover:bg-amber-900/20' : 'odd:bg-white even:bg-slate-50/50 hover:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/30 dark:hover:bg-slate-800/80',
           'group cursor-pointer border-b border-slate-100 transition-colors dark:border-slate-800'
         ]"
         @click="navigateTo(`/gestor/tarefa/${task.id}`)"
        >
         <td class="px-4 py-3 text-sm">
          <span class="font-semibold text-slate-800 dark:text-slate-200">{{ task.title }}</span>
         </td>
         <td class="px-4 py-3 text-sm text-slate-600 whitespace-nowrap dark:text-slate-400">
          <div class="flex items-center gap-2">
           <span class="grid size-5 place-items-center rounded text-[9px] font-bold text-white" :class="team.color">{{ team.initial }}</span>
           <span>{{ team.name }}</span>
          </div>
         </td>
         <td class="px-4 py-3 text-sm whitespace-nowrap">
          <UiStatusBadge :status="task.status" />
          <span v-if="task.status === 'validar'" class="ml-2 inline-flex animate-pulse items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            Validar
          </span>
         </td>
         <td class="px-4 py-3 text-sm whitespace-nowrap"><span class="font-medium" :class="usePriorityMeta(task.priority).text">{{ usePriorityMeta(task.priority).label }}</span></td>
         <td class="px-4 py-3 text-sm whitespace-nowrap">
          <div v-if="task.assignees?.length" class="flex items-center gap-2"><UAvatar :src="task.assignees[0]?.avatar" :alt="task.assignees[0]?.name" size="xs" /><span class="text-slate-600 dark:text-slate-400">{{ task.assignees[0]?.name }}</span></div>
          <span v-else class="text-slate-400">-</span>
         </td>
         <td class="px-4 py-3 text-sm whitespace-nowrap">
          <span v-if="task.dueDate" :class="task.status === 'atrasado' ? 'font-semibold text-red-600' : 'text-slate-600 dark:text-slate-400'">{{ task.dueDate }}</span>
          <span v-else class="text-slate-400">-</span>
         </td>
         <td class="px-4 py-3 text-right text-sm whitespace-nowrap">
          <span v-if="task.stars && task.stars > 0" class="font-medium text-amber-500">+{{ task.stars }}</span>
          <span v-else class="text-slate-400">0</span>
         </td>
        </tr>
       </tbody>
      </table>
     </div>
     <div v-if="!teamTasks.length" class="py-12 text-center text-sm text-slate-400">Nenhuma tarefa nesta equipe.</div>
    </div>
   </section>
  </template>

  <USlideover v-model:open="taskPanelOpen" side="right" :ui="{ content: 'w-full max-w-md' }">
   <template #content>
    <div v-if="selectedTask" class="flex h-full flex-col bg-white dark:bg-slate-900">
     <div class="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
      <div class="min-w-0"><span class="rounded bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-600 dark:bg-violet-500/15">{{ selectedTask.id }}</span><h2 class="mt-3 text-lg font-bold text-slate-800 dark:text-slate-100">{{ selectedTask.title }}</h2></div>
      <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="taskPanelOpen = false" />
     </div>
     <div class="flex-1 space-y-5 overflow-y-auto p-5 text-sm">
      <div class="flex gap-2"><UiStatusBadge :status="selectedTask.status" /><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="priorityColorMap[usePriorityMeta(selectedTask.priority).label]">{{ usePriorityMeta(selectedTask.priority).label }}</span></div>
      <section><h3 class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Descrição</h3><p class="leading-6 text-slate-600 dark:text-slate-300">{{ selectedTask.description || 'Sem descrição adicionada.' }}</p></section>
      <section class="border-y border-slate-100 py-4 dark:border-slate-800"><p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Equipe</p><div class="flex items-center gap-2"><span class="grid size-7 place-items-center rounded text-[10px] font-bold text-white" :class="team?.color">{{ team?.initial }}</span><span class="font-medium text-slate-700 dark:text-slate-200">{{ team?.name }}</span></div></section>
      <section><p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Responsável</p><div v-if="selectedTask.assignees?.[0]" class="flex items-center gap-2"><UAvatar :src="selectedTask.assignees[0].avatar" :alt="selectedTask.assignees[0].name" size="sm" /><span class="font-medium text-slate-700 dark:text-slate-200">{{ selectedTask.assignees[0].name }}</span></div><p v-else class="text-slate-400">Não atribuído</p></section>
      <div class="grid grid-cols-2 gap-3"><section><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Prazo</p><p class="mt-1 font-medium text-slate-700 dark:text-slate-200">{{ selectedTask.dueDate || 'Sem prazo' }}</p></section><section><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Estimativa</p><p class="mt-1 font-medium text-slate-700 dark:text-slate-200">—</p></section></div>
      <section v-if="selectedTask.subtasks?.length"><div class="mb-2 flex items-center justify-between"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Subtarefas</p><span class="text-xs text-slate-400">{{ selectedTask.subtasks.length }}</span></div><div v-for="subtask in selectedTask.subtasks" :key="subtask.id" class="flex items-center gap-2 py-1.5"><UIcon :name="subtask.completed ? 'i-heroicons-check-circle' : 'i-heroicons-check'" :class="subtask.completed ? 'text-emerald-500' : 'text-slate-300'" class="size-4" /><span :class="subtask.completed ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'">{{ subtask.title }}</span></div></section>
     </div>
     <div class="grid grid-cols-2 gap-2 border-t border-slate-100 p-4 dark:border-slate-800"><UButton color="neutral" variant="outline">Pausar tarefa</UButton><UButton class="bg-emerald-500 hover:bg-emerald-600">Marcar concluída</UButton></div>
    </div>
   </template>
  </USlideover>

  <UModal v-model:open="createTaskOpen" :ui="{ content: 'max-w-4xl overflow-hidden rounded-2xl border border-slate-200 shadow-2xl dark:border-slate-700', header: 'border-b border-slate-100 bg-gradient-to-r from-violet-50 via-white to-orange-50 px-6 py-5 dark:border-slate-800 dark:from-violet-950/30 dark:via-slate-900 dark:to-orange-950/20', body: 'bg-slate-50/70 px-6 py-6 dark:bg-slate-900', footer: 'border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900' }">
   <template #header><div class="flex w-full items-center justify-between"><div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 text-white shadow-sm"><UIcon name="i-heroicons-clipboard-document-list" class="size-5" /></span><div><h2 class="font-bold text-slate-900 dark:text-slate-100">Criar nova tarefa</h2><p class="text-xs text-slate-500">Defina a atividade, responsável e prazo da equipe.</p></div></div><UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="createTaskOpen = false" /></div></template>
   <template #body>
    <div class="grid divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[1.55fr_0.85fr] md:divide-x md:divide-y-0 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-950/40">
     <section class="space-y-6 p-5 sm:p-6"><div><label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Título da tarefa <span class="text-rose-500">*</span></label><UInput v-model="newTask.title" size="lg" class="w-full" placeholder="Ex.: Revisar entrega do projeto" :ui="{ root: 'w-full', base: 'w-full placeholder:text-slate-400/65 dark:placeholder:text-slate-500/70' }" /></div><div><label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label><UTextarea v-model="newTask.description" :rows="4" class="w-full" placeholder="Descreva o objetivo, contexto e informações importantes..." :ui="{ root: 'w-full', base: 'w-full placeholder:text-slate-400/65 dark:placeholder:text-slate-500/70' }" /></div><div><div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Subtarefas</h3><UButton size="sm" variant="outline" icon="i-heroicons-plus" @click="addNewSubtask">Adicionar</UButton></div><div class="flex gap-2"><UInput v-model="newTask.subtask" class="min-w-0 flex-1" placeholder="Adicionar uma subtarefa" :ui="{ root: 'min-w-0 flex-1', base: 'w-full placeholder:text-slate-400/65 dark:placeholder:text-slate-500/70' }" @keydown.enter.prevent="addNewSubtask" /><UButton variant="outline" icon="i-heroicons-plus" @click="addNewSubtask" /></div><div v-if="!newSubtasks.length" class="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/30">Nenhuma subtarefa adicionada.</div><div v-for="(subtask, index) in newSubtasks" :key="`${subtask}-${index}`" class="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"><span class="flex items-center gap-2"><UIcon name="i-heroicons-check" class="size-4 text-violet-400" />{{ subtask }}</span><UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="xs" @click="newSubtasks.splice(index, 1)" /></div></div></section>
     <aside class="space-y-5 bg-slate-50/60 p-5 sm:p-6 dark:bg-slate-900/40"><div><label class="mb-2 block text-sm font-semibold">Equipe <span class="text-rose-500">*</span></label><div class="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50/70 px-3 py-2.5 text-sm font-medium text-slate-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-slate-200"><span class="grid size-6 place-items-center rounded-md bg-violet-500 text-white"><UIcon name="i-heroicons-user-group" class="size-3.5" /></span>{{ team?.name }}</div></div><div><label class="mb-2 block text-sm font-semibold">Responsável <span class="text-rose-500">*</span></label><UInput v-model="memberSearch" icon="i-heroicons-magnifying-glass" placeholder="Buscar colaborador" class="mb-2" /><select v-model="newTask.assigneeId" class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="">Selecionar responsável</option><option v-for="member in availableAssignees" :key="member.id" :value="member.id">{{ member.name }}</option></select></div><div><label class="mb-2 block text-sm font-semibold">Prioridade <span class="text-rose-500">*</span></label><div class="grid grid-cols-3 gap-1.5"><button v-for="option in [{ value: 'baixa', label: 'Baixa' }, { value: 'media', label: 'Média' }, { value: 'alta', label: 'Alta' }]" :key="option.value" type="button" class="rounded-lg border px-2 py-2 text-xs font-semibold transition-colors" :class="newTask.priority === option.value ? 'border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900'" @click="newTask.priority = option.value">{{ option.label }}</button></div></div><div><label class="mb-2 block text-sm font-semibold">Prazo <span class="text-rose-500">*</span></label><UInput v-model="newTask.deadline" type="date" icon="i-heroicons-calendar-days" /></div></aside>
    </div>
   </template>
   <template #footer><div class="flex w-full justify-end gap-2"><UButton color="neutral" variant="outline" @click="createTaskOpen = false">Cancelar</UButton><UButton class="bg-orange-500 hover:bg-orange-600" :disabled="!newTask.title || !newTask.deadline" @click="createTeamTask">Criar tarefa</UButton></div></template>
  </UModal>

  <!-- MEMBROS -->
  <template v-if="activeTab === 'membros'">
   <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Membros da equipe ({{ teamMembers.length }})</h2>
    <div class="space-y-2">
     <div
      v-for="member in teamMembers"
      :key="member.id"
      class="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors cursor-pointer group hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
      @click="openMemberModal(member)"
     >
      <UAvatar :src="member.avatar" :alt="member.name" size="md" />
      <div class="min-w-0 flex-1">
       <p class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ member.name }}</p>
       <p class="text-xs text-slate-400">{{ member.role }}</p>
      </div>
      <span v-if="member.role === 'Líder de equipe'" class="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">Líder</span>
      <span v-else class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Membro</span>
      <UIcon name="i-heroicons-chevron-right" class="size-4 ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
     </div>
    </div>
   </section>

   <!-- Member Detail Modal -->
   <UModal v-model:open="memberModalOpen" :ui="{ content: 'max-w-4xl overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 shadow-2xl' }">
     <template #header>
       <div class="flex items-center justify-between p-2">
         <div class="flex items-center gap-4">
           <UAvatar :src="selectedMember?.avatar" :alt="selectedMember?.name" size="lg" class="ring-2 ring-white dark:ring-slate-800" />
           <div>
             <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ selectedMember?.name }}</h3>
             <p class="text-xs text-slate-500">{{ selectedMember?.role }} • Equipe {{ team?.name }}</p>
           </div>
         </div>
         <div class="flex gap-3">
           <UButton size="sm" color="violet" variant="soft" icon="i-heroicons-plus" @click="assignTaskToSelectedMember">Atribuir Tarefa</UButton>
           <UButton size="sm" color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="memberModalOpen = false" />
         </div>
       </div>
     </template>
     <template #body>
       <div class="p-4 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
         <!-- Stats -->
         <div class="space-y-3">
           <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Desempenho (Equipe)</h4>
           
           <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div class="flex items-center gap-2"><div class="size-2 rounded-full bg-slate-400"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">Total</span></div>
             <span class="text-lg font-bold text-slate-900 dark:text-white">{{ memberStats.total }}</span>
           </div>

           <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div class="flex items-center gap-2"><div class="size-2 rounded-full bg-emerald-500"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">Concluídas</span></div>
             <span class="text-lg font-bold text-slate-900 dark:text-white">{{ memberStats.concluidas }}</span>
           </div>

           <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div class="flex items-center gap-2"><div class="size-2 rounded-full bg-amber-500"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">A Validar</span></div>
             <span class="text-lg font-bold text-amber-600">{{ memberStats.validar }}</span>
           </div>

           <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div class="flex items-center gap-2"><div class="size-2 rounded-full bg-rose-500"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">Atrasadas</span></div>
             <span class="text-lg font-bold text-rose-600">{{ memberStats.atrasadas }}</span>
           </div>
         </div>

         <!-- Member Tasks -->
         <div>
           <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tarefas Atribuídas</h4>
           <div v-if="memberTasks.length === 0" class="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
             <UIcon name="i-heroicons-inbox" class="size-8 text-slate-300 mx-auto mb-2" />
             <p class="text-sm text-slate-500">Nenhuma tarefa atribuída a este membro.</p>
           </div>
           <div v-else class="space-y-2 max-h-[400px] overflow-y-auto scroll-thin pr-2">
             <div
               v-for="task in memberTasks"
               :key="task.id"
               class="flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-slate-800 transition-colors cursor-pointer group"
               :class="task.status === 'validar' ? 'border-amber-200 shadow-sm bg-amber-50/30' : 'border-slate-100 dark:border-slate-700 hover:border-violet-300'"
               @click="navigateTo(`/gestor/tarefa/${task.id}`)"
             >
               <div class="min-w-0 flex-1">
                 <h5 class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400">{{ task.title }}</h5>
                 <div class="flex items-center gap-3 mt-1 text-xs text-slate-500">
                   <UiStatusBadge :status="task.status" />
                   <span v-if="task.dueDate" class="flex items-center gap-1"><UIcon name="i-heroicons-calendar" class="size-3" /> {{ task.dueDate }}</span>
                 </div>
               </div>
               <UIcon name="i-heroicons-arrow-right" class="size-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
             </div>
           </div>
         </div>
       </div>
     </template>
   </UModal>
  </template>

  <!-- ATIVIDADE -->
  <template v-if="activeTab === 'atividade'">
   <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Atividade da equipe</h2>
    <div v-if="activities.length === 0" class="py-10 text-center text-slate-400 text-sm">
      Nenhuma atividade registrada na equipe.
    </div>
    <div v-else class="space-y-4 max-h-[600px] overflow-y-auto scroll-thin pr-2">
     <div v-for="act in activities" :key="act.id" class="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
      <div class="grid size-9 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-500/20">
       {{ act.user.split(' ').map((n: string) => n[0]).join('').substring(0, 2) }}
      </div>
      <div class="min-w-0 flex-1">
       <p class="text-sm text-slate-600 dark:text-slate-300"><strong class="text-slate-800 dark:text-slate-100">{{ act.user }}</strong> <template v-if="act.action">{{ act.action }}</template></p>
       <p class="text-sm mt-0.5 text-slate-700 dark:text-slate-300">{{ act.detail || act.message }}</p>
       <NuxtLink v-if="act.taskId" :to="`/gestor/tarefa/${act.taskId}`" class="text-xs font-medium text-violet-600 hover:underline mt-1 block">
         Tarefa: {{ act.taskTitle }}
       </NuxtLink>
      </div>
      <span class="shrink-0 text-xs text-slate-400 pt-0.5">{{ act.time || act.timestamp }}</span>
     </div>
    </div>
   </section>
  </template>
 </div>
</template>
