<script setup lang="ts">
import { useAdminDashboard } from '~/composables/useAdminDashboard'
import chartTeamPerformance from '~/components/chart/chartTeamPerformance.vue'
import chartCollaborators from '~/components/chart/chartCollaborators.vue'
import chartDeliveryPerformance from '~/components/chart/chartDeliveryPerformance.vue'
import chartProjectHealth from '~/components/chart/chartProjectHealth.vue'
import chartProductivityTrend from '~/components/chart/chartProductivityTrend.vue'

// Ativa o widget de Projetos na sidebar (igual colaborador/gestor)
definePageMeta({ sidebarWidget: 'project' })

const user = useCurrentUser()
const firstName = computed(() => user.name.split(' ')[0])

const {
  selectedPeriod,
  periodLabel,
  periodOptions,
  metrics,
  collaborators,
  projectHealth,
  risks,
  activeProjects,
  teamPerformance,
  deliveryPerformance,
  productivityTrend,
} = useAdminDashboard()

// Gradientes dos ícones das métricas (padrão site)
const metricGradients: Record<string, string> = {
  'projetos-ativos': 'bg-gradient-to-br from-violet-500 to-fuchsia-600',
  'equipes': 'bg-gradient-to-br from-orange-400 to-amber-500',
  'colaboradores': 'bg-gradient-to-br from-blue-500 to-sky-600',
  'total-tarefas': 'bg-gradient-to-br from-emerald-500 to-green-600',
}

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

const projectHealthLegend = computed(() => [
  { label: 'No prazo', value: projectHealth.noPrazo, color: 'bg-emerald-500', pct: Math.round((projectHealth.noPrazo / projectHealth.total) * 100) },
  { label: 'Em risco', value: projectHealth.emRisco, color: 'bg-amber-400', pct: Math.round((projectHealth.emRisco / projectHealth.total) * 100) },
  { label: 'Atrasado', value: projectHealth.atrasado, color: 'bg-rose-500', pct: Math.round((projectHealth.atrasado / projectHealth.total) * 100) },
  { label: 'Concluído', value: projectHealth.concluido, color: 'bg-slate-400', pct: Math.round((projectHealth.concluido / projectHealth.total) * 100) },
])
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
          Aqui está o panorama geral da organização e dos projetos.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Calendário -->
        <UPopover>
          <UButton
            color="white"
            variant="solid"
            icon="i-heroicons-calendar-days"
            trailing-icon="i-heroicons-chevron-down"
            class="text-slate-600"
          >
            Set 2026
          </UButton>
          <template #content>
            <UCalendar class="p-2" color="secondary" />
          </template>
        </UPopover>
        <!-- Exportar -->
        <UModal :modal="false" title="Exportar relatório">
          <UButton
            color="white"
            variant="solid"
            icon="i-heroicons-document-arrow-down"
            class="text-slate-600"
          >
            Exportar Relatório
          </UButton>
          <template #body>
            <UFileUpload
              color="neutral"
              highlight
              label="Arraste e solte um arquivo ou clique para selecionar"
              description="PDF, XLS ou CSV (max. 5MB)"
              class="w-full min-h-48"
            />
          </template>
        </UModal>
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
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ m.value }}</p>
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
            <UDropdownMenu
              :items="periodOptions.map(o => ({ label: o.label, click: () => selectedPeriod = o.key }))"
              :ui="{ content: 'w-44' }"
            >
              <UButton
                :label="periodLabel"
                color="neutral"
                variant="ghost"
                size="xs"
                trailing-icon="i-heroicons-chevron-down"
                class="text-xs text-slate-500"
              />
            </UDropdownMenu>
          </div>
        </template>
        <chartTeamPerformance :data="teamPerformance" />
      </UCard>

      <!-- Colaboradores (donut) -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Colaboradores</h3>
        </template>
        <div class="flex flex-col items-center gap-3">
          <div class="relative">
            <chartCollaborators :stats="collaborators" />
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ collaborators.total }}</span>
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
                {{ collaborators.active }} ({{ Math.round((collaborators.active / collaborators.total) * 100) }}%)
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-slate-200 inline-block" />
                <span class="text-slate-500">Inativos</span>
              </div>
              <span class="font-semibold text-slate-700 dark:text-slate-300">
                {{ collaborators.inactive }} ({{ Math.round((collaborators.inactive / collaborators.total) * 100) }}%)
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
            <UDropdownMenu
              :items="periodOptions.map(o => ({ label: o.label, click: () => selectedPeriod = o.key }))"
              :ui="{ content: 'w-44' }"
            >
              <UButton
                :label="periodLabel"
                color="neutral"
                variant="ghost"
                size="xs"
                trailing-icon="i-heroicons-chevron-down"
                class="text-xs text-slate-500"
              />
            </UDropdownMenu>
          </div>
        </template>
        <chartDeliveryPerformance :data="deliveryPerformance" />
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
        <p class="mt-3 text-xs text-slate-400">{{ projectHealth.total }} projetos no total</p>
      </UCard>

      <!-- Riscos e Bloqueios -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Riscos e Bloqueios</h3>
            <span class="text-xs text-violet-600 font-medium cursor-pointer hover:underline">Ver todos →</span>
          </div>
        </template>
        <ul class="space-y-3">
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
            <UDropdownMenu
              :items="periodOptions.map(o => ({ label: o.label, click: () => selectedPeriod = o.key }))"
              :ui="{ content: 'w-44' }"
            >
              <UButton
                :label="periodLabel"
                color="neutral"
                variant="ghost"
                size="xs"
                trailing-icon="i-heroicons-chevron-down"
                class="text-xs text-slate-500"
              />
            </UDropdownMenu>
          </div>
        </template>
        <chartProductivityTrend :data="productivityTrend" />
      </UCard>
    </div>

    <!-- Projetos em andamento (scroll horizontal) -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">Projetos em andamento</h2>
        <NuxtLink to="/admin/projetos" class="text-sm text-violet-600 font-medium hover:underline">Ver todos →</NuxtLink>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-2" style="scroll-snap-type: x mandatory;">
        <UCard
          v-for="project in activeProjects"
          :key="project.id"
          class="shrink-0 w-52 transition-transform hover:-translate-y-0.5"
          style="scroll-snap-align: start;"
          :ui="{ body: { padding: 'p-3' } }"
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
            <!-- Barra estática: width = progresso real -->
            <div class="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                :style="{ width: project.progress + '%' }"
              />
            </div>
            <p class="mt-1.5 text-xs text-slate-400">Prazo: {{ project.deadline }}</p>
          </div>
        </UCard>

        <!-- Novo projeto -->
        <div
          class="flex shrink-0 w-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer group min-h-[130px]"
          style="scroll-snap-align: start;"
        >
          <div class="flex flex-col items-center gap-2 text-slate-400 group-hover:text-violet-500 transition-colors">
            <UIcon name="i-heroicons-plus" class="size-6" />
            <span class="text-sm font-medium">Novo projeto</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
