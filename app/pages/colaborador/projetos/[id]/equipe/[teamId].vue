<script setup lang="ts">
import type { ProjectTeam, ProjectProgress, Task, UserSummary } from '~/types'
definePageMeta({ sidebarWidget: 'project' })

const route = useRoute()
const projectId = route.params.id as string
const teamId = route.params.teamId as string

const projects = useUserProjects()
const project = computed<ProjectProgress | undefined>(() => projects.find(p => p.id === projectId))
const team = computed<ProjectTeam | undefined>(() => project.value?.teams?.find(t => t.id === teamId))

if (!team.value || !project.value) await navigateTo(`/colaborador/projetos/${projectId}`)

const activeTab = ref<'visao-geral' | 'tarefas' | 'membros' | 'atividade'>('visao-geral')

const tabs = [
  { id: 'visao-geral', label: 'Visão geral', icon: 'i-heroicons-squares-2x2' },
  { id: 'tarefas', label: 'Tarefas', icon: 'i-heroicons-clipboard-document-list' },
  { id: 'membros', label: 'Membros', icon: 'i-heroicons-user-group' },
  { id: 'atividade', label: 'Atividade', icon: 'i-heroicons-clock' },
] as const

// Mock members for this team
const teamMembers = computed<UserSummary[]>(() => {
  const count = team.value?.memberCount ?? 3
  const names = ['João Pedro', 'Ana Clara', 'Rafael Lima', 'Beatriz Ribeiro', 'Costa Neves', 'Marina Costa', 'Carlos Mendes']
  return Array.from({ length: Math.min(count, names.length) }, (_, i) => ({
    id: `tm${i}`,
    name: names[i],
    role: i === 0 ? 'Líder de equipe' : 'Colaborador',
    avatar: `https://i.pravatar.cc/48?img=${30 + i}`,
  }))
})

// Tasks: reuse project tasks but label them under team name
const allTasks = useTasksRef()
const teamTasks = computed<Task[]>(() =>
  allTasks.value
    .filter(t => !t.personal && t.project === project.value?.name)
    .slice(0, team.value?.memberCount ? team.value.memberCount + 2 : 5)
)

// Mock activities
const activities = [
  { id: 'a1', user: 'João Pedro', action: 'atualizou o status da tarefa', detail: 'Verificar instalações hidráulicas', time: '2h atrás' },
  { id: 'a2', user: 'Ana Clara', action: 'enviou um novo arquivo', detail: 'Planta elétrica - revisão 02.pdf', time: '5h atrás' },
  { id: 'a3', user: 'Rafael Lima', action: 'comentou na tarefa', detail: 'Fiscalizar obra da Nova Praça Central', time: '1 dia atrás' },
  { id: 'a4', user: 'Macena Souza', action: 'criou a tarefa', detail: 'Revisar cronograma de execução', time: '2 dias atrás' },
  { id: 'a5', user: 'Costa Neves', action: 'concluiu a tarefa', detail: 'Levantar materiais para fundação', time: '3 dias atrás' },
  { id: 'a6', user: 'Ana Clara', action: 'adicionou um membro', detail: 'Carlos Mendes entrou na equipe', time: '4 dias atrás' },
]

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
</script>

<template>
 <div v-if="team && project" class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
  <!-- Breadcrumb -->
  <nav class="flex items-center gap-1.5 text-sm text-slate-400">
   <NuxtLink to="/colaborador/projetos" class="hover:text-slate-600">Projetos</NuxtLink>
   <UIcon name="i-heroicons-chevron-right" class="size-3" />
   <NuxtLink :to="`/colaborador/projetos/${project.id}`" class="hover:text-slate-600">{{ project.name }}</NuxtLink>
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
     Projeto: <NuxtLink :to="`/colaborador/projetos/${project.id}`" class="text-orange-500 hover:underline">{{ project.name }}</NuxtLink>
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
        {{ act.user.split(' ').map(n => n[0]).join('') }}
       </div>
       <div class="min-w-0 flex-1">
        <p class="text-sm text-slate-600 dark:text-slate-300"><strong class="text-slate-800 dark:text-slate-100">{{ act.user }}</strong> {{ act.action }}</p>
        <p class="text-xs text-slate-400 truncate">"{{ act.detail }}"</p>
       </div>
       <span class="shrink-0 text-xs text-slate-400">{{ act.time }}</span>
      </div>
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
         class="group cursor-pointer border-b border-slate-100 transition-colors odd:bg-white even:bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-800/30 dark:hover:bg-slate-800/80"
         @click="navigateTo(`/colaborador/tarefa/${task.id}`)"
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
         <td class="px-4 py-3 text-sm whitespace-nowrap"><UiStatusBadge :status="task.status" /></td>
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

  <!-- MEMBROS -->
  <template v-if="activeTab === 'membros'">
   <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Membros da equipe ({{ teamMembers.length }})</h2>
    <div class="space-y-2">
     <div
      v-for="member in teamMembers"
      :key="member.id"
      class="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
     >
      <UAvatar :src="member.avatar" :alt="member.name" size="md" />
      <div class="min-w-0 flex-1">
       <p class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ member.name }}</p>
       <p class="text-xs text-slate-400">{{ member.role }}</p>
      </div>
      <span v-if="member.role === 'Líder de equipe'" class="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">Líder</span>
      <span v-else class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Membro</span>
     </div>
    </div>
   </section>
  </template>

  <!-- ATIVIDADE -->
  <template v-if="activeTab === 'atividade'">
   <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Atividade da equipe</h2>
    <div class="space-y-4">
     <div v-for="act in activities" :key="act.id" class="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
      <div class="grid size-9 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-500/20">
       {{ act.user.split(' ').map(n => n[0]).join('') }}
      </div>
      <div class="min-w-0 flex-1">
       <p class="text-sm text-slate-600 dark:text-slate-300"><strong class="text-slate-800 dark:text-slate-100">{{ act.user }}</strong> {{ act.action }}</p>
       <p class="text-xs text-slate-400 mt-0.5">"{{ act.detail }}"</p>
      </div>
      <span class="shrink-0 text-xs text-slate-400 pt-0.5">{{ act.time }}</span>
     </div>
    </div>
   </section>
  </template>
 </div>
</template>
