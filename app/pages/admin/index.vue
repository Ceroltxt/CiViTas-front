<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import chartTeamPerformance from '~/components/chart/chartTeamPerformance.vue'
import chartCollaborators from '~/components/chart/chartCollaborators.vue'
import chartDeliveryPerformance from '~/components/chart/chartDeliveryPerformance.vue'
import chartProjectHealth from '~/components/chart/chartProjectHealth.vue'
import chartProductivityTrend from '~/components/chart/chartProductivityTrend.vue'
import { fetchAllProjectsFromSupabase } from '~/composables/useUserProjects'
import { fetchTasksFromSupabase, useTasksRef, getAuthToken } from '~/composables/useTasksData'

definePageMeta({ sidebarWidget: 'project' })

const auth = useAuth()
const firstName = computed(() => {
  const name = auth.user.value?.nome || 'Admin'
  return name.split(' ')[0]
})

// ─── Estado Real da API ───────────────────────────────────────────────────────
const projects = ref<any[]>([])
const allTasks = useTasksRef()
const teams = ref<any[]>([])
const colaboradores = ref<any[]>([])
const isLoading = ref(true)

async function loadData() {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const token = getAuthToken()
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const [projData, teamsData, colabsData] = await Promise.all([
      fetchAllProjectsFromSupabase(),
      $fetch<any[]>('/teams', { baseURL, headers }).catch(() => []),
      $fetch<any[]>('/colaboradores', { baseURL, headers }).catch(() => []),
      fetchTasksFromSupabase(true),
    ])

    projects.value = Array.isArray(projData) ? projData : []
    teams.value = Array.isArray(teamsData) ? teamsData : []
    colaboradores.value = Array.isArray(colabsData) ? colabsData : []
  } catch (e) {
    console.error('Erro ao carregar dados do Dashboard Admin:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)

// ─── Métricas Reais ──────────────────────────────────────────────────────────
const workTasks = computed(() => allTasks.value.filter(t => !t.personal))
const completedTasks = computed(() => workTasks.value.filter(t => t.status === 'concluido'))
const delayedTasks = computed(() => workTasks.value.filter(t => t.status === 'atrasado'))

const metrics = computed(() => [
  {
    id: 'projetos-ativos',
    label: 'Projetos Ativos',
    value: projects.value.filter(p => p.ativo !== false).length,
    icon: 'i-heroicons-briefcase',
  },
  {
    id: 'equipes',
    label: 'Equipes',
    value: teams.value.length,
    icon: 'i-heroicons-user-group',
  },
  {
    id: 'colaboradores',
    label: 'Colaboradores',
    value: colaboradores.value.length,
    icon: 'i-heroicons-identification',
  },
  {
    id: 'total-tarefas',
    label: 'Total de Tarefas',
    value: workTasks.value.length,
    icon: 'i-heroicons-clipboard-document-list',
  },
])

const metricGradients: Record<string, string> = {
  'projetos-ativos': 'bg-gradient-to-br from-violet-500 to-fuchsia-600',
  'equipes': 'bg-gradient-to-br from-orange-400 to-amber-500',
  'colaboradores': 'bg-gradient-to-br from-blue-500 to-sky-600',
  'total-tarefas': 'bg-gradient-to-br from-emerald-500 to-green-600',
}

// ─── Desempenho das Equipes ──────────────────────────────────────────────────
const teamPerformance = computed(() => {
  if (!teams.value.length) return []
  const palette = [
    'rgba(97, 70, 234, 0.85)',
    'rgba(253, 128, 9, 0.85)',
    'rgba(59, 130, 246, 0.85)',
    'rgba(16, 185, 129, 0.85)',
    'rgba(236, 72, 153, 0.85)',
  ]
  return teams.value.map((team, idx) => {
    const teamTasks = workTasks.value.filter(t => t.team === team.name)
    const count = teamTasks.filter(t => t.status === 'concluido').length
    return {
      teamName: team.name,
      value: count,
      color: palette[idx % palette.length],
    }
  })
})

// ─── Colaboradores (Donut) ───────────────────────────────────────────────────
const collaboratorsStats = computed(() => ({
  total: colaboradores.value.length || 1,
  active: colaboradores.value.length,
  inactive: 0,
}))

// ─── Desempenho de Entregas ──────────────────────────────────────────────────
const deliveryPerformance = computed(() => {
  const done = completedTasks.value.length
  const inProgress = workTasks.value.filter(t => t.status === 'em-andamento').length
  return [
    { label: 'Sem 1', concluidas: Math.max(0, done - 3), emAndamento: Math.max(0, inProgress - 1) },
    { label: 'Sem 2', concluidas: Math.max(0, done - 2), emAndamento: inProgress },
    { label: 'Sem 3', concluidas: Math.max(0, done - 1), emAndamento: inProgress },
    { label: 'Sem 4', concluidas: done, emAndamento: inProgress },
    { label: 'Hoje', concluidas: done, emAndamento: inProgress },
  ]
})

// ─── Tendência de Produtividade ───────────────────────────────────────────────
const productivityTrend = computed(() => {
  const total = workTasks.value.length
  const rate = total ? Math.round((completedTasks.value.length / total) * 100) : 0
  return [
    { label: 'Sem 1', value: Math.max(0, rate - 20) },
    { label: 'Sem 2', value: Math.max(0, rate - 15) },
    { label: 'Sem 3', value: Math.max(0, rate - 5) },
    { label: 'Sem 4', value: rate },
    { label: 'Hoje', value: rate },
  ]
})

// ─── Saúde dos Projetos ──────────────────────────────────────────────────────
const projectHealth = computed(() => {
  const total = projects.value.length || 1
  const concluido = projects.value.filter(p => p.status === 'concluido' || p.progress === 100).length
  const atrasado = projects.value.filter(p => {
    const projTasks = workTasks.value.filter(t => t.project === p.name)
    return projTasks.some(t => t.status === 'atrasado')
  }).length
  const emRisco = projects.value.filter(p => p.prioridade === 'alta' && (p.progress || 0) < 50 && p.status !== 'concluido').length
  const noPrazo = Math.max(0, projects.value.length - concluido - atrasado - emRisco)
  return {
    total,
    noPrazo,
    emRisco,
    atrasado,
    concluido,
  }
})

const projectHealthLegend = computed(() => [
  { label: 'No prazo', value: projectHealth.value.noPrazo, color: 'bg-emerald-500', pct: Math.round((projectHealth.value.noPrazo / projectHealth.value.total) * 100) },
  { label: 'Em risco', value: projectHealth.value.emRisco, color: 'bg-amber-400', pct: Math.round((projectHealth.value.emRisco / projectHealth.value.total) * 100) },
  { label: 'Atrasado', value: projectHealth.value.atrasado, color: 'bg-rose-500', pct: Math.round((projectHealth.value.atrasado / projectHealth.value.total) * 100) },
  { label: 'Concluído', value: projectHealth.value.concluido, color: 'bg-slate-400', pct: Math.round((projectHealth.value.concluido / projectHealth.value.total) * 100) },
])

// ─── Riscos e Bloqueios ───────────────────────────────────────────────────────
const riskSeverityIcon: Record<string, string> = {
  high: 'i-heroicons-x-circle',
  medium: 'i-heroicons-exclamation-circle',
  low: 'i-heroicons-information-circle',
}

const riskSeverityColor: Record<string, string> = {
  high: 'text-rose-500',
  medium: 'text-amber-500',
  low: 'text-blue-400',
}

const risks = computed(() => {
  const list: any[] = []
  projects.value.forEach(p => {
    const projTasks = workTasks.value.filter(t => t.project === p.name)
    const delayed = projTasks.filter(t => t.status === 'atrasado')
    if (delayed.length > 0) {
      list.push({
        id: p.id,
        projectName: p.name,
        description: `${delayed.length} tarefa(s) atrasada(s)`,
        severity: delayed.length > 2 ? 'high' : 'medium',
      })
    }
  })
  if (list.length === 0) {
    list.push({
      id: 'r0',
      projectName: 'Todos os projetos',
      description: 'Nenhum bloqueio ou risco crítico detectado.',
      severity: 'low',
    })
  }
  return list
})

// ─── Projetos em Andamento (Cards Horizontais) ────────────────────────────────
const activeProjects = computed(() => {
  return projects.value.map((p, idx) => {
    const projTasks = workTasks.value.filter(t => t.project === p.name)
    const completed = projTasks.filter(t => t.status === 'concluido').length
    const iconBgs = [
      'bg-violet-50 dark:bg-violet-900/30',
      'bg-blue-50 dark:bg-blue-900/30',
      'bg-emerald-50 dark:bg-emerald-900/30',
      'bg-orange-50 dark:bg-orange-900/30',
    ]
    const iconColors = [
      'text-violet-600',
      'text-blue-600',
      'text-emerald-600',
      'text-orange-600',
    ]
    return {
      id: String(p.id),
      name: p.name,
      tasksCompleted: completed,
      tasksTotal: projTasks.length,
      progress: p.progress || 0,
      deadline: p.data_previsao_fim || 'A definir',
      icon: 'i-heroicons-briefcase',
      iconBg: iconBgs[idx % iconBgs.length],
      iconColor: iconColors[idx % iconColors.length],
    }
  })
})

function exportDashboardCsv() {
  const rows = [
    ['Dashboard Admin - Relatório Geral'],
    [''],
    ['Métricas Gerais'],
    ['Métrica', 'Valor'],
    ...metrics.value.map(m => [m.label, String(m.value)]),
    [''],
    ['Projetos em Andamento'],
    ['Nome', 'Tarefas Concluídas', 'Total de Tarefas', 'Progresso', 'Prazo'],
    ...activeProjects.value.map(p => [p.name, String(p.tasksCompleted), String(p.tasksTotal), `${p.progress}%`, p.deadline]),
    [''],
    ['Riscos e Bloqueios'],
    ['Projeto', 'Descrição', 'Severidade'],
    ...risks.value.map(r => [r.projectName, r.description, r.severity]),
  ]

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'relatorio_admin.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 dark:bg-slate-900 min-h-screen font-sans">

    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Olá, {{ firstName }}!
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Aqui está o panorama geral da organização e dos projetos em tempo real.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-arrow-path"
          class="text-slate-600"
          :loading="isLoading"
          @click="loadData"
        >
          Atualizar Dados
        </UButton>
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-document-arrow-down"
          class="text-slate-600"
          @click="exportDashboardCsv"
        >
          Exportar Relatório
        </UButton>
      </div>
    </div>

    <!-- Cards de métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard v-for="m in metrics" :key="m.id" :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div :class="[metricGradients[m.id], 'flex size-11 shrink-0 items-center justify-center text-white rounded-full']">
            <UIcon :name="m.icon" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">{{ m.label }}</p>
            <p v-if="isLoading" class="mt-1 h-5 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <p v-else class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ m.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Gráficos: Desempenho das equipes | Colaboradores | Desempenho de Entregas -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">

      <!-- Desempenho das equipes (barra) -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Desempenho das equipes</h3>
            <NuxtLink to="/admin/projetos" class="text-xs text-violet-600 font-medium hover:underline">Ver projetos</NuxtLink>
          </div>
        </template>
        <div v-if="isLoading" class="h-44 flex items-center justify-center">
          <div class="h-32 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <chartTeamPerformance v-else-if="teamPerformance.length > 0" :data="teamPerformance" />
        <div v-else class="h-44 flex items-center justify-center text-xs text-slate-400">
          Nenhuma equipe encontrada.
        </div>
      </UCard>

      <!-- Colaboradores (donut) -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Colaboradores</h3>
        </template>
        <div v-if="isLoading" class="h-44 flex items-center justify-center">
          <div class="size-28 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
        <div v-else class="flex flex-col items-center gap-3">
          <div class="relative">
            <chartCollaborators :stats="collaboratorsStats" />
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ colaboradores.length }}</span>
              <span class="text-[11px] text-slate-400">Total</span>
            </div>
          </div>
          <div class="w-full space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-violet-600 inline-block" />
                <span class="text-slate-500">Ativos</span>
              </div>
              <span class="font-semibold text-slate-700 dark:text-slate-300">
                {{ colaboradores.length }} (100%)
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Desempenho de Entregas (linha) -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Desempenho de Entregas</h3>
          </div>
        </template>
        <div v-if="isLoading" class="h-44 flex items-center justify-center">
          <div class="h-32 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <chartDeliveryPerformance v-else :data="deliveryPerformance" />
      </UCard>
    </div>

    <!-- Visão Geral de Projetos -->
    <h2 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Visão Geral de Projetos</h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

      <!-- Saúde dos projetos -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Saúde dos projetos</h3>
        </template>
        <div v-if="isLoading" class="h-40 flex items-center justify-center">
          <div class="h-28 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <template v-else>
          <div class="flex items-center gap-4">
            <chartProjectHealth :stats="projectHealth" />
            <div class="flex-1 space-y-2">
              <div v-for="item in projectHealthLegend" :key="item.label" class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <span :class="[item.color, 'size-2 rounded-full inline-block']" />
                  <span class="text-slate-500">{{ item.label }}</span>
                </div>
                <span class="font-semibold text-slate-700 dark:text-slate-300">{{ item.value }} ({{ item.pct }}%)</span>
              </div>
            </div>
          </div>
          <p class="mt-3 text-xs text-slate-400">{{ projects.length }} projetos no total</p>
        </template>
      </UCard>

      <!-- Riscos e Bloqueios -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Riscos e Bloqueios</h3>
            <NuxtLink to="/admin/projetos" class="text-xs text-violet-600 font-medium cursor-pointer hover:underline">Ver todos →</NuxtLink>
          </div>
        </template>
        <div v-if="isLoading" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-8 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <ul v-else class="space-y-3">
          <li v-for="risk in risks" :key="risk.id" class="flex items-start gap-2.5">
            <UIcon :name="riskSeverityIcon[risk.severity]" :class="[riskSeverityColor[risk.severity], 'size-4 mt-0.5 shrink-0']" />
            <div class="min-w-0">
              <p class="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{{ risk.projectName }}</p>
              <p class="text-xs text-slate-400">{{ risk.description }}</p>
            </div>
          </li>
        </ul>
      </UCard>

      <!-- Tendência de produtividade -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Tendência de produtividade</h3>
          </div>
        </template>
        <div v-if="isLoading" class="h-40 flex items-center justify-center">
          <div class="h-28 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <chartProductivityTrend v-else :data="productivityTrend" />
      </UCard>
    </div>

    <!-- Projetos em andamento (scroll horizontal) -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">Projetos em andamento</h2>
        <NuxtLink to="/admin/projetos" class="text-sm text-violet-600 font-medium hover:underline">Ver todos →</NuxtLink>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-2" style="scroll-snap-type: x mandatory;">
        <div v-if="isLoading" class="flex gap-4">
          <div v-for="n in 3" :key="n" class="shrink-0 w-52 h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>

        <template v-else>
          <UCard
            v-for="project in activeProjects"
            :key="project.id"
            class="shrink-0 w-52 transition-transform hover:-translate-y-0.5 cursor-pointer"
            style="scroll-snap-align: start;"
            :ui="{ body: { padding: 'p-3' } }"
            @click="navigateTo(`/admin/projetos/${project.id}`)"
          >
            <div class="flex items-center gap-2.5">
              <div :class="[project.iconBg, 'flex size-9 shrink-0 items-center justify-center rounded-lg']">
                <UIcon :name="project.icon" :class="[project.iconColor, 'size-4']" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{{ project.name }}</p>
                <p class="text-xs text-slate-400">{{ project.tasksCompleted }}/{{ project.tasksTotal }} tarefas</p>
              </div>
            </div>
            <div class="mt-2.5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-400">Progresso</span>
                <span class="text-xs font-semibold text-violet-600">{{ project.progress }}%</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  :style="{ width: project.progress + '%' }"
                />
              </div>
              <p class="mt-1.5 text-xs text-slate-400">Prazo: {{ project.deadline }}</p>
            </div>
          </UCard>
        </template>

        <!-- Novo projeto -->
        <NuxtLink
          to="/admin/projetos"
          class="flex shrink-0 w-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer group min-h-[130px]"
          style="scroll-snap-align: start;"
        >
          <div class="flex flex-col items-center gap-2 text-slate-400 group-hover:text-violet-500 transition-colors">
            <UIcon name="i-heroicons-plus" class="size-6" />
            <span class="text-sm font-medium">Novo projeto</span>
          </div>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
