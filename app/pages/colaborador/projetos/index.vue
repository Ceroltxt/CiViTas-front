<script setup lang="ts">
import type { Task } from '~/types'
import { fetchUserProjectsFromSupabase, useGestorProjectsRef, useProjectsLoading } from '~/composables/useUserProjects'

definePageMeta({ sidebarWidget: 'project' })

const projectsRef = useGestorProjectsRef()
const isLoadingProjects = useProjectsLoading()
const tasks = useTasksRef()
const search = ref('')

onMounted(() => fetchUserProjectsFromSupabase())

// ─── Drag & Drop (Mover) ────────────────────────────────────────────────────
const STORAGE_KEY = 'civitas_project_order_colaborador'
const projectOrder = ref<string[]>([])
const draggedProjectId = ref<string | null>(null)
const dragOverProjectId = ref<string | null>(null)
const isDragMode = ref(false)

function loadOrder() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) projectOrder.value = JSON.parse(stored)
  } catch {}
}

function saveOrder() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projectOrder.value))
}

onMounted(loadOrder)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function projectTone(color: string) {
  const tones: Record<string, { surface: string, text: string }> = {
    'bg-blue-500': { surface: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500' },
    'bg-violet-500': { surface: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-500' },
    'bg-amber-400': { surface: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500' },
    'bg-pink-500': { surface: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-500' },
    'bg-cyan-500': { surface: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-500' },
    'bg-indigo-500': { surface: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-500' },
  }
  return tones[color] ?? { surface: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-500' }
}

const priorityLabel: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
const priorityClass: Record<string, string> = {
  alta: 'text-red-600 bg-red-50 dark:bg-red-500/10',
  media: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
  baixa: 'text-green-600 bg-green-50 dark:bg-green-500/10',
}
const statusMeta: Record<string, { label: string, class: string, dot: string }> = {
  ativo: { label: 'Ativo', class: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30', dot: 'bg-emerald-500' },
  concluido: { label: 'Concluído', class: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30', dot: 'bg-blue-500' },
  planejamento: { label: 'Planejamento', class: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300', dot: 'bg-violet-500' },
  pausado: { label: 'Pausado', class: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300', dot: 'bg-amber-500' },
}

const projectCards = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  let result = projectsRef.value
    .filter(p => !term || p.name.toLocaleLowerCase('pt-BR').includes(term))
    .map((project: any) => {
      const projectTasks = tasks.value.filter((task: Task) => !task.personal && task.project === project.name)
      const done = projectTasks.filter((task: Task) => task.status === 'concluido').length
      return {
        ...project,
        status: project.status ?? (project.ativo !== false ? 'ativo' : 'concluido'),
        description: project.description ?? 'Projeto em acompanhamento.',
        priority: project.prioridade ?? 'media',
        taskCount: projectTasks.length,
        doneCount: done,
      }
    })

  if (projectOrder.value.length > 0) {
    const orderMap = new Map(projectOrder.value.map((id, idx) => [id, idx]))
    result = [...result].sort((a, b) => {
      const ai = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999
      const bi = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999
      return ai - bi
    })
  }

  return result
})

const router = useRouter()
function openProject(projectId: string) {
  router.push(`/colaborador/projetos/${projectId}`)
}

// ─── Context menu ────────────────────────────────────────────────────────────
function getDropdownItems() {
  return [[{
    label: isDragMode.value ? 'Sair do modo mover' : 'Mover',
    icon: 'i-heroicons-arrows-up-down',
    onSelect() {
      isDragMode.value = !isDragMode.value
    },
  }]]
}

// ─── Drag handlers ───────────────────────────────────────────────────────────
function onDragStart(e: DragEvent, projectId: string) {
  if (!isDragMode.value) { e.preventDefault(); return }
  draggedProjectId.value = projectId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', projectId)
  }
}

function onDragOver(e: DragEvent, projectId: string) {
  if (!isDragMode.value) return
  e.preventDefault()
  dragOverProjectId.value = projectId
}

function onDragLeave() { dragOverProjectId.value = null }

function onDrop(e: DragEvent, targetId: string) {
  if (!isDragMode.value) return
  e.preventDefault()
  dragOverProjectId.value = null
  const sourceId = draggedProjectId.value
  if (!sourceId || sourceId === targetId) return
  const currentIds = projectCards.value.map(p => p.id)
  const sourceIdx = currentIds.indexOf(sourceId)
  const targetIdx = currentIds.indexOf(targetId)
  if (sourceIdx === -1 || targetIdx === -1) return
  currentIds.splice(sourceIdx, 1)
  currentIds.splice(targetIdx, 0, sourceId)
  projectOrder.value = currentIds
  saveOrder()
  draggedProjectId.value = null
}

function onDragEnd() { draggedProjectId.value = null; dragOverProjectId.value = null }
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Projetos</h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Acompanhe os projetos dos quais você faz parte e suas entregas.</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          v-if="isDragMode"
          color="primary"
          variant="soft"
          icon="i-heroicons-check"
          label="Concluir reordenação"
          @click="isDragMode = false"
        />
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs text-slate-400">Projetos vinculados</p>
          <p class="mt-0.5 text-xl font-bold text-slate-800 dark:text-slate-100">{{ projectCards.length }}</p>
        </div>
      </div>
    </div>

    <!-- Busca -->
    <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar projetos" class="w-full sm:w-64" />
    </div>

    <!-- Drag mode banner -->
    <div v-if="isDragMode" class="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
      <UIcon name="i-heroicons-arrows-up-down" class="size-5" />
      <span>Modo de reordenação ativado. Arraste os projetos para a posição desejada.</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoadingProjects" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-56 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
    </div>

    <!-- Grid de projetos -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="project in projectCards"
        :key="project.id"
        class="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30"
        :class="{
          'cursor-grab': isDragMode,
          'cursor-pointer': !isDragMode,
          'ring-2 ring-violet-400 ring-offset-2': dragOverProjectId === project.id,
          'opacity-50': draggedProjectId === project.id,
        }"
        :draggable="isDragMode"
        @click="!isDragMode && openProject(project.id)"
        @dragstart="onDragStart($event, project.id)"
        @dragover="onDragOver($event, project.id)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, project.id)"
        @dragend="onDragEnd"
      >
        <div class="p-5 pb-4">
          <div class="flex items-start justify-between gap-3">
            <span class="grid size-14 place-items-center rounded-2xl" :class="projectTone(project.color).surface">
              <UIcon name="i-heroicons-folder" class="size-7" :class="projectTone(project.color).text" />
            </span>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1"
                :class="(statusMeta[project.status] ?? statusMeta.ativo).class"
              >
                <span class="size-1.5 rounded-full" :class="(statusMeta[project.status] ?? statusMeta.ativo).dot" />
                {{ (statusMeta[project.status] ?? statusMeta.ativo).label }}
              </span>
              <UDropdownMenu :items="getDropdownItems()">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-ellipsis-vertical"
                  aria-label="Ações do projeto"
                  class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  @click.stop
                />
              </UDropdownMenu>
            </div>
          </div>
          <div class="mt-4">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ project.name }}</h2>
            <span class="mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold"
              :class="priorityClass[project.priority] ?? priorityClass.media">
              <UIcon name="i-heroicons-arrow-trending-up" class="size-3.5" />
              {{ priorityLabel[project.priority] ?? 'Média' }}
            </span>
          </div>
          <p class="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {{ project.description }}
          </p>

          <div class="mt-5 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5"><UIcon name="i-heroicons-user" class="size-4" /> Macena Souza</span>
            <span v-if="project.data_previsao_fim" class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-calendar-days" class="size-4" />
              {{ project.data_previsao_fim }}
            </span>
            <span v-else class="flex items-center gap-1.5 text-slate-300">
              <UIcon name="i-heroicons-calendar-days" class="size-4" />
              Sem prazo definido
            </span>
          </div>

          <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-2xl font-bold" :class="projectTone(project.color).text">{{ project.progress }}%</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ project.doneCount }} de {{ project.taskCount }} tarefas concluídas</p>
              </div>
              <div class="mb-1 h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div class="h-full rounded-full transition-all" :class="project.color" :style="{ width: `${project.progress}%` }" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
          <button type="button" class="flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-300" @click.stop="openProject(project.id)">
            Ver projeto <UIcon name="i-heroicons-arrow-right" class="size-4" />
          </button>
          <button type="button" class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" @click.stop="openProject(project.id)">
            <UIcon name="i-heroicons-list-bullet" class="size-4" />
            Tarefas
          </button>
        </div>
      </article>
    </div>

    <div v-if="!isLoadingProjects && projectCards.length === 0" class="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
      <UIcon name="i-heroicons-folder-open" class="mx-auto size-8 text-slate-300" />
      <p class="mt-3 text-sm font-medium text-slate-500">Você ainda não está em nenhum projeto.</p>
      <p class="text-xs text-slate-400 mt-1">Um gestor precisa adicioná-lo a uma equipe primeiro.</p>
    </div>
  </div>
</template>
