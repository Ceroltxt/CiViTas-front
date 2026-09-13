<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Task } from '~/types'
import { getAuthToken } from '~/composables/useTasksData'
import { fetchUserProjectsFromSupabase, useGestorProjectsRef } from '~/composables/useUserProjects'

definePageMeta({ sidebarWidget: 'project' })

const route = useRoute()
const projectId = route.params.id as string
const teamId = route.params.teamId as string

// ─── Config ──────────────────────────────────────────────────────────────────
const config = useRuntimeConfig()
const baseURL = computed(() => (config.public.apiBase as string) || 'http://localhost:8080/api')
function authHeaders() {
  const t = getAuthToken()
  return { Accept: 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) }
}

// ─── Dados do projeto ────────────────────────────────────────────────────────
const gestorProjects = useGestorProjectsRef()
onMounted(() => fetchUserProjectsFromSupabase())
const project = computed(() => gestorProjects.value.find(p => p.id === projectId))

// ─── Dados reais da equipe ────────────────────────────────────────────────────
const teamData = ref<any>(null)
const teamGestor = ref<any>(null)
const teamMembers = ref<any[]>([])
const isLoadingTeam = ref(true)

async function loadTeam() {
  isLoadingTeam.value = true
  try {
    const teams = await $fetch<any[]>('/teams', { baseURL: baseURL.value, headers: authHeaders() })
    const found = Array.isArray(teams) ? teams.find((t: any) => String(t.id) === teamId) : null
    if (found) teamData.value = found

    const membersRes = await $fetch<any>(`/teams/${teamId}/members`, {
      baseURL: baseURL.value,
      headers: authHeaders(),
    })
    teamGestor.value = membersRes?.gestor || null
    teamMembers.value = membersRes?.members || []
  } catch (e) {
    console.error('Erro ao carregar equipe:', e)
  } finally {
    isLoadingTeam.value = false
  }
}

onMounted(loadTeam)

// ─── Tarefas da equipe ────────────────────────────────────────────────────────
const allTasks = useTasksRef()
const teamTasks = computed<Task[]>(() =>
  allTasks.value.filter(t => !t.personal && t.project === project.value?.name)
)

const totalTasks = computed(() => teamTasks.value.length)
const doneTasks = computed(() => teamTasks.value.filter(t => t.status === 'concluido').length)
const inProgress = computed(() => teamTasks.value.filter(t => t.status === 'em-andamento').length)
const delayedTasks = computed(() => teamTasks.value.filter(t => t.status === 'atrasado').length)
const progressPercent = computed(() => totalTasks.value ? Math.round((doneTasks.value / totalTasks.value) * 100) : 0)

// ─── Abas ─────────────────────────────────────────────────────────────────────
const activeTab = ref<'visao-geral' | 'tarefas' | 'membros'>('visao-geral')
const tabs = [
  { id: 'visao-geral', label: 'Visão geral', icon: 'i-heroicons-squares-2x2' },
  { id: 'tarefas', label: 'Tarefas', icon: 'i-heroicons-clipboard-document-list' },
  { id: 'membros', label: 'Membros', icon: 'i-heroicons-user-group' },
] as const

// ─── Misc helpers ─────────────────────────────────────────────────────────────
function teamInitial(name: string) {
  return name ? name.substring(0, 2).toUpperCase() : 'EQ'
}

const teamColor = computed(() => teamData.value?.color || 'bg-violet-500')
const teamName = computed(() => teamData.value?.name || teamData.value?.nome || '...')
const teamLeader = computed(() => teamGestor.value?.name || teamData.value?.leader || '—')
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-sm text-slate-400">
      <NuxtLink to="/colaborador/projetos" class="hover:text-slate-600">Projetos</NuxtLink>
      <UIcon name="i-heroicons-chevron-right" class="size-3" />
      <NuxtLink :to="`/colaborador/projetos/${projectId}`" class="hover:text-slate-600">
        {{ project?.name || `Projeto #${projectId}` }}
      </NuxtLink>
      <UIcon name="i-heroicons-chevron-right" class="size-3" />
      <span class="text-slate-600 font-medium">{{ teamName }}</span>
    </nav>

    <!-- Loading state -->
    <div v-if="isLoadingTeam" class="space-y-4">
      <div class="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      <div class="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
    </div>

    <template v-else>
      <!-- Header -->
      <section class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span class="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white" :class="teamColor">
          {{ teamInitial(teamName) }}
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{{ teamName }}</h1>
          <p class="text-xs text-slate-400">
            <UIcon name="i-heroicons-folder" class="inline size-3" />
            Projeto:
            <NuxtLink :to="`/colaborador/projetos/${projectId}`" class="text-orange-500 hover:underline">
              {{ project?.name || `#${projectId}` }}
            </NuxtLink>
          </p>
        </div>
        <div class="flex items-center gap-6 text-sm text-slate-500">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-user-group" class="size-4" />
            <span class="font-bold text-slate-700 dark:text-slate-200">{{ teamMembers.length }}</span> Membros
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-clipboard-document-list" class="size-4" />
            <span class="font-bold text-slate-700 dark:text-slate-200">{{ totalTasks }}</span> Tarefas
          </div>
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

      <!-- ── VISÃO GERAL ──────────────────────────────────────────────────── -->
      <template v-if="activeTab === 'visao-geral'">
        <div class="grid gap-5 lg:grid-cols-2">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Sobre a equipe</h2>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-3 text-slate-500">
                <UIcon name="i-heroicons-user-circle" class="size-4 text-slate-400" />
                <div>
                  <small class="text-xs text-slate-400">Gestor responsável</small>
                  <p class="font-medium text-slate-700 dark:text-slate-200">{{ teamLeader }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-slate-500">
                <UIcon name="i-heroicons-user-group" class="size-4 text-slate-400" />
                <div>
                  <small class="text-xs text-slate-400">Membros na equipe</small>
                  <p class="font-medium text-slate-700 dark:text-slate-200">{{ teamMembers.length }} colaborador(es)</p>
                </div>
              </div>
            </div>
          </section>

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
            <div class="grid grid-cols-2 gap-3">
              <div v-for="stat in [
                { label: 'Total', value: totalTasks, icon: 'i-heroicons-chart-bar', color: 'text-slate-600 bg-slate-50' },
                { label: 'Concluídas', value: doneTasks, icon: 'i-heroicons-check-circle', color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Em andamento', value: inProgress, icon: 'i-heroicons-clock', color: 'text-amber-600 bg-amber-50' },
                { label: 'Atrasadas', value: delayedTasks, icon: 'i-heroicons-exclamation-triangle', color: 'text-red-600 bg-red-50' },
              ]" :key="stat.label" class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div class="flex items-center gap-3">
                  <span class="grid size-9 place-items-center rounded-lg" :class="stat.color">
                    <UIcon :name="stat.icon" class="size-4" />
                  </span>
                  <div>
                    <p class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ stat.value }}</p>
                    <p class="text-xs text-slate-500">{{ stat.label }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>

      <!-- ── TAREFAS ──────────────────────────────────────────────────────── -->
      <template v-if="activeTab === 'tarefas'">
        <section class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas da equipe</h2>
            <p class="text-xs text-slate-400">Acompanhe as atividades do projeto.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900/50">
                  <th class="px-4 py-3">Tarefa</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Prioridade</th>
                  <th class="px-4 py-3">Responsável</th>
                  <th class="px-4 py-3">Prazo</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="task in teamTasks"
                  :key="task.id"
                  class="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80"
                  @click="navigateTo(`/colaborador/tarefa/${task.id}`)"
                >
                  <td class="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{{ task.title }}</td>
                  <td class="px-4 py-3 text-sm whitespace-nowrap"><UiStatusBadge :status="task.status" /></td>
                  <td class="px-4 py-3 text-sm whitespace-nowrap">
                    <span class="font-medium" :class="usePriorityMeta(task.priority).text">{{ usePriorityMeta(task.priority).label }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm whitespace-nowrap">
                    <div v-if="task.assignees?.length" class="flex items-center gap-2">
                      <UAvatar :src="task.assignees[0]?.avatar" :alt="task.assignees[0]?.name" size="xs" />
                      <span class="text-slate-600 dark:text-slate-400">{{ task.assignees[0]?.name }}</span>
                    </div>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                  <td class="px-4 py-3 text-sm whitespace-nowrap">
                    <span v-if="task.dueDate" :class="task.status === 'atrasado' ? 'font-semibold text-red-600' : 'text-slate-600 dark:text-slate-400'">
                      {{ task.dueDate }}
                    </span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                </tr>
                <tr v-if="!teamTasks.length">
                  <td colspan="5" class="py-12 text-center text-sm text-slate-400">
                    <UIcon name="i-heroicons-inbox" class="mx-auto size-8 mb-2" />
                    <p>Nenhuma tarefa nesta equipe.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <!-- ── MEMBROS ──────────────────────────────────────────────────────── -->
      <template v-if="activeTab === 'membros'">
        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Membros da equipe ({{ teamMembers.length + (teamGestor ? 1 : 0) }})
          </h2>
          <div class="space-y-2">
            <!-- Gestor -->
            <div v-if="teamGestor" class="flex items-center gap-4 rounded-xl border border-violet-100 bg-violet-50/50 p-3 dark:border-violet-500/20 dark:bg-violet-500/10">
              <div class="grid size-10 shrink-0 place-items-center rounded-full bg-violet-500 text-xs font-bold text-white">
                {{ teamGestor.name?.substring(0, 2).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ teamGestor.name }}</p>
                <p class="text-xs text-slate-400">Gestor responsável</p>
              </div>
              <span class="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                Gestor
              </span>
            </div>

            <!-- Membros -->
            <div
              v-for="member in teamMembers"
              :key="member.id"
              class="flex items-center gap-4 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div class="grid size-10 shrink-0 place-items-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                {{ member.name?.substring(0, 2).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ member.name }}</p>
                <p class="text-xs text-slate-400">{{ member.role || 'Colaborador' }}</p>
              </div>
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Membro
              </span>
            </div>

            <!-- Empty -->
            <div v-if="!teamGestor && !teamMembers.length" class="py-10 text-center text-slate-400 text-sm">
              <UIcon name="i-heroicons-user-group" class="mx-auto size-8 mb-2" />
              <p>Nenhum membro na equipe ainda.</p>
            </div>
          </div>
        </section>
      </template>
    </template>
  </div>
</template>
