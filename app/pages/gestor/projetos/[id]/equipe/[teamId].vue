<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
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

// ─── Dados do projeto (da ref reativa compartilhada) ─────────────────────────
const gestorProjects = useGestorProjectsRef()
onMounted(() => fetchUserProjectsFromSupabase())

const project = computed(() => gestorProjects.value.find(p => p.id === projectId))

// ─── Dados reais da equipe ────────────────────────────────────────────────────
const teamData = ref<any>(null)    // { id, name, leader, gestorId, memberCount, taskCount, color, initial }
const teamGestor = ref<any>(null)  // { id, name, role }
const teamMembers = ref<any[]>([]) // [{ id, name, role }]
const isLoadingTeam = ref(true)

async function loadTeam() {
  isLoadingTeam.value = true
  try {
    // Busca dados da equipe via GET /teams (filtrando pelo ID)
    const teams = await $fetch<any[]>('/teams', { baseURL: baseURL.value, headers: authHeaders() })
    const found = Array.isArray(teams) ? teams.find((t: any) => String(t.id) === teamId) : null
    if (found) teamData.value = found

    // Busca membros da equipe via GET /teams/{id}/members
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

// ─── Todos os colaboradores disponíveis (para adicionar) ─────────────────────
const allColaboradores = ref<any[]>([])
const isLoadingColaboradores = ref(false)

async function loadColaboradores() {
  if (allColaboradores.value.length > 0) return
  isLoadingColaboradores.value = true
  try {
    const data = await $fetch<any[]>('/colaboradores', { baseURL: baseURL.value, headers: authHeaders() })
    allColaboradores.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Erro ao carregar colaboradores:', e)
  } finally {
    isLoadingColaboradores.value = false
  }
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────
const addMemberOpen = ref(false)
const addMemberSearch = ref('')
const isAddingMember = ref(false)
const addMemberError = ref<string | null>(null)

const colaboradoresDisponives = computed(() => {
  const existingIds = new Set([
    ...(teamGestor.value ? [String(teamGestor.value.id)] : []),
    ...teamMembers.value.map((m: any) => String(m.id)),
  ])
  const term = addMemberSearch.value.trim().toLowerCase()
  return allColaboradores.value.filter((c: any) => {
    const notInTeam = !existingIds.has(String(c.id))
    const matchesSearch = !term || c.name.toLowerCase().includes(term)
    return notInTeam && matchesSearch
  })
})

async function openAddMember() {
  addMemberSearch.value = ''
  addMemberError.value = null
  addMemberOpen.value = true
  await loadColaboradores()
}

async function addMemberToTeam(colaboradorId: string) {
  if (isAddingMember.value) return
  isAddingMember.value = true
  addMemberError.value = null
  try {
    await $fetch(`/teams/${teamId}/members`, {
      method: 'POST',
      baseURL: baseURL.value,
      headers: authHeaders(),
      body: { matricula_funcionario: Number(colaboradorId) },
    })
    await loadTeam()
    addMemberOpen.value = false
  } catch (e: any) {
    addMemberError.value = e?.data?.message || 'Erro ao adicionar membro. Tente novamente.'
  } finally {
    isAddingMember.value = false
  }
}

async function removeMember(memberId: string) {
  if (!confirm('Remover este membro da equipe?')) return
  try {
    await $fetch(`/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
      baseURL: baseURL.value,
      headers: authHeaders(),
    })
    await loadTeam()
  } catch (e) {
    console.error('Erro ao remover membro:', e)
  }
}

// ─── Tarefas da equipe (do estado global de tasks) ────────────────────────────
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

// ─── Criar Tarefa ─────────────────────────────────────────────────────────────
const createTaskOpen = ref(false)
const isCreatingTask = ref(false)
const newTask = reactive({ title: '', description: '', assigneeId: '', priority: 'media', deadline: '', subtask: '' })
const newSubtasks = ref<string[]>([])
const memberSearch = ref('')

const allMembersForTask = computed(() => {
  const result: any[] = []
  if (teamGestor.value) result.push({ ...teamGestor.value, role: 'Gestor' })
  result.push(...teamMembers.value)
  const term = memberSearch.value.trim().toLowerCase()
  return term ? result.filter(m => m.name.toLowerCase().includes(term)) : result
})

function addNewSubtask() {
  const title = newTask.subtask.trim()
  if (title) newSubtasks.value.push(title)
  newTask.subtask = ''
}

async function createTeamTask() {
  if (isCreatingTask.value || !newTask.title.trim() || !newTask.deadline) return
  isCreatingTask.value = true

  const assigneeIdNum = newTask.assigneeId && !isNaN(Number(newTask.assigneeId))
    ? Number(newTask.assigneeId) : null

  try {
    await $fetch<any>('/tasks', {
      method: 'POST',
      baseURL: baseURL.value,
      headers: authHeaders(),
      body: {
        nome: newTask.title.trim(),
        descricao: newTask.description.trim() || undefined,
        prioridade: newTask.priority,
        data_prazo: newTask.deadline,
        ID_projeto: Number(projectId),
        ID_equipe: Number(teamId),
        matricula_colaborador: assigneeIdNum ? [assigneeIdNum] : [],
        subtarefas: newSubtasks.value,
      },
    })

    // Recarregar tarefas
    const { fetchTasksFromSupabase } = await import('~/composables/useTasksData')
    fetchTasksFromSupabase(true)
  } catch (e) {
    console.error('Erro ao criar tarefa:', e)
  } finally {
    Object.assign(newTask, { title: '', description: '', assigneeId: '', priority: 'media', deadline: '', subtask: '' })
    newSubtasks.value = []
    memberSearch.value = ''
    createTaskOpen.value = false
    isCreatingTask.value = false
  }
}

// ─── Misc helpers ─────────────────────────────────────────────────────────────
const priorityColorMap: Record<string, string> = {
  'Alta': 'text-red-600 bg-red-50',
  'Média': 'text-amber-600 bg-amber-50',
  'Baixa': 'text-green-600 bg-green-50',
}

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
      <NuxtLink to="/gestor/projetos" class="hover:text-slate-600">Projetos</NuxtLink>
      <UIcon name="i-heroicons-chevron-right" class="size-3" />
      <NuxtLink :to="`/gestor/projetos/${projectId}`" class="hover:text-slate-600">
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
            <NuxtLink :to="`/gestor/projetos/${projectId}`" class="text-orange-500 hover:underline">
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
          <!-- Sobre a equipe -->
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

          <!-- Progresso rápido -->
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
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div>
              <h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas da equipe</h2>
              <p class="text-xs text-slate-400">Acompanhe e distribua as atividades.</p>
            </div>
            <UButton icon="i-heroicons-plus" size="sm" class="bg-orange-500 hover:bg-orange-600" @click="createTaskOpen = true">
              Criar tarefa
            </UButton>
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
                  @click="navigateTo(`/gestor/tarefa/${task.id}`)"
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
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">
              Membros da equipe ({{ teamMembers.length + (teamGestor ? 1 : 0) }})
            </h2>
            <UButton
              size="sm"
              icon="i-heroicons-user-plus"
              class="bg-violet-600 hover:bg-violet-700 text-white"
              @click="openAddMember"
            >
              Adicionar Membro
            </UButton>
          </div>

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
              class="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors dark:border-slate-800 group hover:bg-slate-50 dark:hover:bg-slate-800"
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
              <button
                type="button"
                class="ml-1 flex items-center justify-center size-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Remover membro"
                @click="removeMember(member.id)"
              >
                <UIcon name="i-heroicons-user-minus" class="size-4" />
              </button>
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

    <!-- ── Modal Adicionar Membro ────────────────────────────────────────── -->
    <UModal v-model:open="addMemberOpen" :ui="{ content: 'max-w-md' }">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Adicionar Colaborador</h2>
          <button type="button" class="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" @click="addMemberOpen = false">
            <UIcon name="i-heroicons-x-mark" class="size-5" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="space-y-3">
          <p v-if="addMemberError" class="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-lg p-2">
            {{ addMemberError }}
          </p>

          <UInput
            v-model="addMemberSearch"
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar por nome..."
            class="w-full"
          />

          <div v-if="isLoadingColaboradores" class="py-8 text-center text-sm text-slate-400">
            <UIcon name="i-heroicons-arrow-path" class="mx-auto size-5 mb-2 animate-spin" />
            Carregando colaboradores...
          </div>

          <div v-else class="max-h-72 overflow-y-auto space-y-1 pr-1">
            <button
              v-for="colab in colaboradoresDisponives"
              :key="colab.id"
              type="button"
              class="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-colors hover:bg-violet-50 hover:border-violet-200 dark:border-slate-800 dark:hover:bg-violet-500/10"
              :class="isAddingMember && 'opacity-50 pointer-events-none'"
              @click="addMemberToTeam(colab.id)"
            >
              <div class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                {{ colab.name?.substring(0, 2).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ colab.name }}</p>
                <p class="text-xs text-slate-400">{{ colab.role }}</p>
              </div>
              <UIcon name="i-heroicons-plus-circle" class="size-5 text-violet-400 shrink-0" />
            </button>

            <div v-if="colaboradoresDisponives.length === 0" class="py-8 text-center text-sm text-slate-400">
              <UIcon name="i-heroicons-users" class="mx-auto size-6 mb-2" />
              <p>Nenhum colaborador disponível.</p>
              <p class="text-xs mt-1 text-slate-300">Todos já fazem parte desta equipe.</p>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Modal Criar Tarefa ─────────────────────────────────────────────── -->
    <UModal v-model:open="createTaskOpen" :ui="{ content: 'max-w-3xl overflow-hidden rounded-2xl' }">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 text-white">
              <UIcon name="i-heroicons-clipboard-document-list" class="size-5" />
            </span>
            <div>
              <h2 class="font-bold text-slate-900 dark:text-slate-100">Criar nova tarefa</h2>
              <p class="text-xs text-slate-500">Defina a atividade, responsável e prazo.</p>
            </div>
          </div>
          <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="createTaskOpen = false" />
        </div>
      </template>

      <template #body>
        <div class="grid divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white md:grid-cols-[1.55fr_0.85fr] md:divide-x md:divide-y-0 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-950/40">
          <section class="space-y-5 p-5">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Título <span class="text-rose-500">*</span></label>
              <UInput v-model="newTask.title" size="lg" class="w-full" placeholder="Ex.: Revisar entrega do projeto" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label>
              <UTextarea v-model="newTask.description" :rows="4" class="w-full" placeholder="Descreva o objetivo e contexto..." />
            </div>
            <div>
              <div class="mb-2 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Subtarefas</h3>
              </div>
              <div class="flex gap-2">
                <UInput v-model="newTask.subtask" class="flex-1" placeholder="Adicionar subtarefa" @keydown.enter.prevent="addNewSubtask" />
                <UButton variant="outline" icon="i-heroicons-plus" @click="addNewSubtask" />
              </div>
              <div v-for="(subtask, index) in newSubtasks" :key="index" class="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                <span class="flex items-center gap-2"><UIcon name="i-heroicons-check" class="size-4 text-violet-400" />{{ subtask }}</span>
                <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="xs" @click="newSubtasks.splice(index, 1)" />
              </div>
            </div>
          </section>

          <aside class="space-y-5 bg-slate-50/60 p-5 dark:bg-slate-900/40">
            <div>
              <label class="mb-2 block text-sm font-semibold">Responsável</label>
              <UInput v-model="memberSearch" icon="i-heroicons-magnifying-glass" placeholder="Buscar membro" class="mb-2" />
              <select v-model="newTask.assigneeId" class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                <option value="">Selecionar responsável</option>
                <option v-for="member in allMembersForTask" :key="member.id" :value="member.id">
                  {{ member.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold">Prioridade <span class="text-rose-500">*</span></label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="option in [{ value: 'baixa', label: 'Baixa' }, { value: 'media', label: 'Média' }, { value: 'alta', label: 'Alta' }]"
                  :key="option.value"
                  type="button"
                  class="rounded-lg border px-2 py-2 text-xs font-semibold transition-colors"
                  :class="newTask.priority === option.value ? 'border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900'"
                  @click="newTask.priority = option.value"
                >{{ option.label }}</button>
              </div>
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold">Prazo <span class="text-rose-500">*</span></label>
              <UInput v-model="newTask.deadline" type="date" icon="i-heroicons-calendar-days" />
            </div>
          </aside>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="createTaskOpen = false">Cancelar</UButton>
          <UButton
            class="bg-orange-500 hover:bg-orange-600"
            :disabled="!newTask.title || !newTask.deadline || isCreatingTask"
            :loading="isCreatingTask"
            @click="createTeamTask"
          >
            Criar tarefa
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
