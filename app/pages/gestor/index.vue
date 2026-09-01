<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import chartLine from '~/components/chart/chartLine.vue'
import type { DashboardMetricItem, DashboardProjectItem } from '~/composables/useDashboardApi'

definePageMeta({ sidebarWidget: 'none' })

const auth = useAuth()
const dashboardApi = useDashboardApi()

const firstName = computed(() => {
  const name = auth.user.value?.nome || 'Gestor'
  return name.split(' ')[0]
})

const metricsData = ref<DashboardMetricItem[]>([])
const projectsData = ref<DashboardProjectItem[]>([])
const teamsData = ref<any[]>([])
const allTasks = useTasksData()

const isLoading = ref(true)

async function loadDashboardData() {
  isLoading.value = true
  try {
    const [m, p] = await Promise.all([
      dashboardApi.fetchMetrics(),
      dashboardApi.fetchProjects(),
    ])
    metricsData.value = m
    projectsData.value = p

    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }
    const t = await $fetch<any[]>(ENDPOINTS.teams, { baseURL, headers })
    if (Array.isArray(t)) teamsData.value = t
  } catch (e) {
    console.error('Erro ao carregar dados do dashboard no Gestor:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})

/* Métricas calculadas com fallback */
const projectCount = computed(() => projectsData.value.length || 1)
const teamCount = computed(() => teamsData.value.length || 1)
const delayedCount = computed(() => {
  const fromMetrics = metricsData.value.find(m => m.id === 'atraso')?.value
  if (fromMetrics !== undefined) return Number(fromMetrics)
  return allTasks.filter(t => t.status === 'atrasado').length
})
const productivityRate = computed(() => {
  const fromMetrics = metricsData.value.find(m => m.id === 'produtividade')?.value
  if (fromMetrics) return fromMetrics
  const completed = allTasks.filter(t => t.status === 'concluido').length
  const total = allTasks.length
  return total ? `${Math.round((completed / total) * 100)}%` : '0%'
})

const totalCompletedCount = computed(() => allTasks.filter(t => t.status === 'concluido').length)
</script>

<template>
  <div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 dark:bg-slate-900 min-h-screen font-sans">
    
    <!-- Top Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Olá, {{ firstName }}!
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Acompanhe o desempenho das suas equipes e projetos.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <UButton color="white" variant="solid" icon="i-heroicons-arrow-path" class="text-slate-600" :loading="isLoading" @click="loadDashboardData">
          Atualizar Dados
        </UButton>
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-full">
            <UIcon name="i-heroicons-briefcase" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Projetos gerenciados</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ projectCount }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-blue-500 to-sky-600 text-white rounded-full">
            <UIcon name="i-heroicons-user-group" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Equipes</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ teamCount }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full">
            <UIcon name="i-heroicons-exclamation-triangle" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Tarefas atrasadas</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ delayedCount }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full">
            <UIcon name="i-heroicons-check-circle" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Progresso geral</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ productivityRate }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Middle Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Minhas equipes -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Minhas equipes</h3>
            <NuxtLink to="/gestor/equipes" class="text-sm text-violet-600 font-medium hover:underline">Ver todas</NuxtLink>
          </div>
        </template>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="pb-3 pr-2 text-left">Equipe</th>
                <th class="pb-3 px-2 text-center">Membros</th>
                <th class="pb-3 px-2 text-center">Tarefas</th>
                <th class="pb-3 pl-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="team in teamsData" :key="team.id">
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded bg-violet-600 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                      {{ team.name ? team.name.substring(0, 2) : 'EQ' }}
                    </div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">{{ team.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500">{{ team.members?.length || 1 }}</td>
                <td class="py-3 px-2 text-center font-semibold text-slate-700 dark:text-slate-300">{{ allTasks.length }}</td>
                <td class="py-3 pl-2 text-right">
                  <UBadge color="emerald" variant="subtle" class="font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10">Ativa</UBadge>
                </td>
              </tr>
              <tr v-if="teamsData.length === 0">
                <td colspan="4" class="py-4 text-center text-slate-400 text-xs">Nenhuma equipe cadastrada.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

      <!-- Desempenho dos projetos -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Desempenho dos projetos</h3>
            <NuxtLink to="/gestor/quadros" class="text-sm text-violet-600 font-medium hover:underline">Ver quadros</NuxtLink>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="pb-3 pr-2 text-left">Projeto</th>
                <th class="pb-3 px-2 w-32 text-left">Progresso</th>
                <th class="pb-3 px-2 text-center">Tarefas Totais</th>
                <th class="pb-3 px-2 text-center">Atrasadas</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="proj in projectsData" :key="proj.id">
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="size-2.5 rounded-full bg-violet-500 shrink-0"></div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">{{ proj.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">{{ proj.progress }}%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" :style="{ width: `${proj.progress}%` }"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500 font-medium">{{ allTasks.length }}</td>
                <td class="py-3 px-2 text-center text-rose-500 font-medium">{{ delayedCount }}</td>
              </tr>
              <tr v-if="projectsData.length === 0">
                <td colspan="4" class="py-4 text-center text-slate-400 text-xs">Nenhum projeto encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Evolução das entregas -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Evolução das entregas</h3>
          </div>
        </template>
        
        <div class="h-64 mb-8 w-full relative">
          <ClientOnly>
            <chartLine 
              :labels="['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Hoje']"
              :datasets="[
                { label: 'Concluídas', data: [1, 2, 3, totalCompletedCount, totalCompletedCount], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.4 },
                { label: 'Atrasadas', data: [0, 1, 0, delayedCount, delayedCount], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.4 }
              ]"
            />
          </ClientOnly>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10">
            <div class="p-2.5 bg-white shadow-sm border border-emerald-100 text-emerald-500 rounded-full dark:bg-emerald-900/40 dark:border-emerald-800">
              <UIcon name="i-heroicons-check" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">{{ totalCompletedCount }}</p>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Tarefas concluídas</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3 bg-rose-50/50 p-4 rounded-xl border border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10">
            <div class="p-2.5 bg-white shadow-sm border border-rose-100 text-rose-500 rounded-full dark:bg-rose-900/40 dark:border-rose-800">
              <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">{{ delayedCount }}</p>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Tarefas atrasadas</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Atenção do gestor -->
      <UCard class="flex flex-col">
        <template #header>
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Atenção do gestor</h3>
        </template>
        
        <div class="flex-1 flex flex-col gap-5 py-2">
          <!-- Item 1 -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-exclamation-triangle" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">{{ delayedCount }} tarefas precisam de atenção</p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">Verifique as tarefas marcadas com atraso ou prazo estourado.</p>
            </div>
            <UButton to="/gestor/quadros" color="white" variant="outline" size="sm" class="text-red-600 border-red-200 hover:bg-red-50 px-4">Ver tarefas</UButton>
          </div>
          
          <UDivider />
          
          <!-- Item 2 -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-calendar-days" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">Projeto em andamento</p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">"{{ projectsData[0]?.name || 'Nova Praça Central' }}" está em andamento.</p>
            </div>
            <UButton to="/gestor/quadros" color="white" variant="outline" size="sm" class="text-orange-600 border-orange-200 hover:bg-orange-50 px-4">Ver quadros</UButton>
          </div>
        </div>
      </UCard>
    </div>

  </div>
</template>
