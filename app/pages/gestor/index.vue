<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import chartLine from '~/components/chart/chartLine.vue'
import { fetchUserProjectsFromSupabase, useGestorProjectsRef, useProjectsLoading } from '~/composables/useUserProjects'
import { fetchTasksFromSupabase, useTasksRef, useTasksLoading, getAuthToken } from '~/composables/useTasksData'

definePageMeta({ sidebarWidget: 'none' })

const auth = useAuth()

const firstName = computed(() => {
  const name = auth.user.value?.nome || 'Gestor'
  return name.split(' ')[0]
})

const gestorProjects = useGestorProjectsRef()
const allTasks = useTasksRef()
const isLoadingProjects = useProjectsLoading()
const isLoadingTasks = useTasksLoading()

const teamsData = ref<any[]>([])
const isLoadingTeams = ref(true)

async function fetchTeams() {
  isLoadingTeams.value = true
  try {
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const token = getAuthToken()
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const t = await $fetch<any[]>('/teams', { baseURL, headers })
    if (Array.isArray(t)) {
      teamsData.value = t
    }
  } catch (e) {
    console.error('Erro ao buscar equipes no Gestor:', e)
  } finally {
    isLoadingTeams.value = false
  }
}

async function loadDashboardData() {
  await Promise.all([
    fetchUserProjectsFromSupabase(true),
    fetchTasksFromSupabase(true),
    fetchTeams(),
  ])
}

onMounted(() => {
  loadDashboardData()
})

const isLoading = computed(() => isLoadingProjects.value || isLoadingTasks.value || isLoadingTeams.value)

/* Métricas reais derivadas do banco */
const projectCount = computed(() => gestorProjects.value.length)
const teamCount = computed(() => teamsData.value.length)

const workTasks = computed(() => allTasks.value.filter(t => !t.personal))
const delayedTasks = computed(() => workTasks.value.filter(t => t.status === 'atrasado'))
const delayedCount = computed(() => delayedTasks.value.length)
const completedTasks = computed(() => workTasks.value.filter(t => t.status === 'concluido'))
const totalCompletedCount = computed(() => completedTasks.value.length)

const productivityRate = computed(() => {
  const total = workTasks.value.length
  if (!total) return '0%'
  return `${Math.round((completedTasks.value.length / total) * 100)}%`
})
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
          Acompanhe o desempenho das suas equipes e projetos em tempo real.
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
            <p v-if="isLoading" class="mt-1 h-5 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <p v-else class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ projectCount }}</p>
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
            <p v-if="isLoading" class="mt-1 h-5 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <p v-else class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ teamCount }}</p>
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
            <p v-if="isLoading" class="mt-1 h-5 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <p v-else class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ delayedCount }}</p>
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
            <p v-if="isLoading" class="mt-1 h-5 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <p v-else class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">{{ productivityRate }}</p>
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
        
        <div v-if="isLoading" class="space-y-3 p-4">
          <div v-for="n in 3" :key="n" class="h-8 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div v-else class="overflow-x-auto">
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
                <td class="py-3 px-2 text-center text-slate-500">{{ team.memberCount ?? 0 }}</td>
                <td class="py-3 px-2 text-center font-semibold text-slate-700 dark:text-slate-300">
                  {{ workTasks.filter(t => t.team === team.name).length }}
                </td>
                <td class="py-3 pl-2 text-right">
                  <UBadge color="emerald" variant="subtle" class="font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10">Ativa</UBadge>
                </td>
              </tr>
              <tr v-if="teamsData.length === 0">
                <td colspan="4" class="py-8 text-center text-slate-400 text-xs">Nenhuma equipe cadastrada ainda.</td>
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
            <NuxtLink to="/gestor/projetos" class="text-sm text-violet-600 font-medium hover:underline">Ver projetos</NuxtLink>
          </div>
        </template>

        <div v-if="isLoading" class="space-y-3 p-4">
          <div v-for="n in 3" :key="n" class="h-8 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div v-else class="overflow-x-auto">
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
              <tr v-for="proj in gestorProjects" :key="proj.id">
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
                <td class="py-3 px-2 text-center text-slate-500 font-medium">
                  {{ workTasks.filter(t => t.project === proj.name).length }}
                </td>
                <td class="py-3 px-2 text-center text-rose-500 font-medium">
                  {{ workTasks.filter(t => t.project === proj.name && t.status === 'atrasado').length }}
                </td>
              </tr>
              <tr v-if="gestorProjects.length === 0">
                <td colspan="4" class="py-8 text-center text-slate-400 text-xs">Nenhum projeto encontrado.</td>
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
                { label: 'Concluídas', data: [0, 1, 1, totalCompletedCount, totalCompletedCount], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.4 },
                { label: 'Atrasadas', data: [0, 0, 0, delayedCount, delayedCount], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.4 }
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
          <!-- Item 1: Tarefas atrasadas -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-exclamation-triangle" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {{ delayedCount > 0 ? `${delayedCount} tarefas precisam de atenção` : 'Nenhuma tarefa atrasada' }}
              </p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">
                {{ delayedCount > 0 ? 'Verifique as tarefas marcadas com atraso ou prazo estourado.' : 'Todas as atividades da equipe estão em dia.' }}
              </p>
            </div>
            <UButton to="/gestor/projetos" color="white" variant="outline" size="sm" class="text-red-600 border-red-200 hover:bg-red-50 px-4">Ver projetos</UButton>
          </div>
          
          <UDivider />
          
          <!-- Item 2: Projeto em andamento -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-calendar-days" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">Projetos em andamento</p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">
                {{ gestorProjects[0] ? `"${gestorProjects[0].name}" e mais ${gestorProjects.length - 1} projeto(s)` : 'Nenhum projeto ativo no momento.' }}
              </p>
            </div>
            <UButton to="/gestor/projetos" color="white" variant="outline" size="sm" class="text-orange-600 border-orange-200 hover:bg-orange-50 px-4">Ver projetos</UButton>
          </div>
        </div>
      </UCard>
    </div>

  </div>
</template>
