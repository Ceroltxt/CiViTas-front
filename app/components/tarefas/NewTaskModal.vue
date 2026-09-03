<script setup lang="ts">
import type { PriorityKey, Task, Subtask } from '~/types'
import { addTask } from '~/composables/useTasksData'
import { ENDPOINTS } from '~/services/endpoints'

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ created: [] }>()

const auth = useAuth()
const config = useRuntimeConfig()
const authToken = useCookie<string | null>('auth_token')

const isGestorOrAdmin = computed(() => {
  const role = (auth.user.value?.app_role || '').toLowerCase()
  return role === 'gestor' || role === 'admin'
})

interface AssigneeOption {
  id: string
  name: string
  role: string
}

interface ProjectOption {
  id: string
  name: string
}

/* ── Form state ── */
const title = ref('')
const description = ref('')
const priority = ref<PriorityKey | ''>('')
const deadline = ref('')
const selectedAssignee = ref<string>('1')
const selectedProject = ref<string>('1')
const availableAssignees = ref<AssigneeOption[]>([
  { id: '1', name: 'Costa Neves (Desenvolvedor)', role: 'Colaborador' },
])
const availableProjects = ref<ProjectOption[]>([
  { id: '1', name: 'Nova Praça Central' },
])
const subtaskInput = ref('')
const subtasks = ref<string[]>([])
const notifyUpdates = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

/* ── Validation ── */
const submitted = ref(false)

const errors = computed(() => ({
  title: submitted.value && !title.value.trim(),
  priority: submitted.value && !priority.value,
  deadline: submitted.value && !deadline.value,
  deadlinePast: submitted.value && !!deadline.value && deadline.value < todayISO.value,
}))

const todayISO = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const priorityPills: { value: PriorityKey; label: string; dot: string }[] = [
  { value: 'alta', label: 'Alta', dot: 'bg-rose-500' },
  { value: 'media', label: 'Média', dot: 'bg-amber-400' },
  { value: 'baixa', label: 'Baixa', dot: 'bg-emerald-500' },
]

function getHeaders() {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (authToken.value) {
    headers.Authorization = `Bearer ${authToken.value}`
  }
  return headers
}

async function loadSupabaseData() {
  try {
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = getHeaders()

    // Busca equipes e membros reais do Supabase
    const teamsData = await $fetch<any[]>(ENDPOINTS.teams, { baseURL, headers })
    const membersMap = new Map<string, AssigneeOption>()

    if (Array.isArray(teamsData)) {
      teamsData.forEach((team) => {
        if (Array.isArray(team.members)) {
          team.members.forEach((m: any) => {
            membersMap.set(String(m.id), {
              id: String(m.id),
              name: `${m.name} (${m.role || 'Colaborador'})`,
              role: m.role || 'Colaborador',
            })
          })
        }
      })
    }

    const fetchedAssignees = Array.from(membersMap.values())
    if (fetchedAssignees.length > 0) {
      availableAssignees.value = fetchedAssignees
      if (!selectedAssignee.value || !membersMap.has(selectedAssignee.value)) {
        selectedAssignee.value = fetchedAssignees[0].id
      }
    }

    // Busca projetos reais do Supabase
    const projectsData = await $fetch<any[]>(ENDPOINTS.dashboard.projects, { baseURL, headers })
    if (Array.isArray(projectsData) && projectsData.length > 0) {
      availableProjects.value = projectsData.map((p: any) => ({
        id: String(p.id),
        name: p.name,
      }))
      selectedProject.value = availableProjects.value[0].id
    }
  } catch (e) {
    console.error('Erro ao buscar dados do Supabase:', e)
  }
}

watch(open, (isOpen) => {
  if (isOpen && isGestorOrAdmin.value) {
    loadSupabaseData()
  }
}, { immediate: true })

function addSubtask() {
  const v = subtaskInput.value.trim()
  if (v && !subtasks.value.includes(v)) {
    subtasks.value.unshift(v)
  }
  subtaskInput.value = ''
}

function onSubtaskKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addSubtask()
  }
}

function removeSubtask(index: number) {
  subtasks.value.splice(index, 1)
}

const draggedIndex = ref<number | null>(null)

function onDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDragEnter(index: number) {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  const items = [...subtasks.value]
  const draggedItem = items[draggedIndex.value]
  items.splice(draggedIndex.value, 1)
  items.splice(index, 0, draggedItem)
  subtasks.value = items
  draggedIndex.value = index
}

function onDragEnd() {
  draggedIndex.value = null
}

function resetForm() {
  title.value = ''
  description.value = ''
  priority.value = ''
  deadline.value = ''
  subtaskInput.value = ''
  subtasks.value = []
  notifyUpdates.value = true
  submitted.value = false
  isSubmitting.value = false
  errorMessage.value = null
}

function closeModal() {
  open.value = false
  resetForm()
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d} ${['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][Number(m) - 1]}`
}

async function createTask() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  submitted.value = true
  errorMessage.value = null

  // Validação dos campos obrigatórios
  if (!title.value.trim()) {
    errorMessage.value = 'O título da tarefa é obrigatório.'
    isSubmitting.value = false
    return
  }
  if (!priority.value) {
    errorMessage.value = 'Selecione a prioridade da tarefa.'
    isSubmitting.value = false
    return
  }
  if (!deadline.value) {
    errorMessage.value = 'Selecione o prazo final da tarefa.'
    isSubmitting.value = false
    return
  }
  if (deadline.value < todayISO.value) {
    errorMessage.value = 'O prazo final deve ser hoje ou uma data futura.'
    isSubmitting.value = false
    return
  }

  try {
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = getHeaders()
    const assigneeList = selectedAssignee.value ? [Number(selectedAssignee.value)] : []

    // Chamada à API real do Laravel / Supabase
    const apiResponse = await $fetch<any>(ENDPOINTS.tasks, {
      method: 'POST',
      baseURL,
      headers,
      body: {
        nome: title.value.trim(),
        descricao: description.value.trim(),
        prioridade: priority.value,
        data_prazo: deadline.value,
        ID_projeto: isGestorOrAdmin.value && selectedProject.value ? Number(selectedProject.value) : null,
        matricula_colaborador: isGestorOrAdmin.value ? assigneeList : [],
        pessoal: !isGestorOrAdmin.value,
        subtarefas: subtasks.value,
      },
    })

    // Adiciona a resposta da API no estado local da tela
    const assignedUser = availableAssignees.value.find(a => a.id === selectedAssignee.value)

    const createdId = apiResponse?.data?.id || apiResponse?.id
    const newTask: Task = {
      id: createdId ? String(createdId) : `tp-${Date.now()}`,
      title: title.value.trim(),
      description: description.value.trim(),
      priority: priority.value as PriorityKey,
      status: 'a-fazer',
      personal: !isGestorOrAdmin.value,
      dueDate: formatDate(deadline.value),
      startDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''),
      assignees: assignedUser ? [{ id: assignedUser.id, name: assignedUser.name, role: assignedUser.role }] : [],
      subtasks: subtasks.value.map((st, i) => ({ id: `st-${i}`, title: st, completed: false })),
    }

    addTask(newTask)
    emit('created')
    closeModal()
  } catch (err: any) {
    console.error('Erro na API Supabase:', err)
    const backendError = err?.data?.errors ? Object.values(err.data.errors).flat().join(' ') : null
    errorMessage.value = backendError || err?.data?.message || err?.message || 'Erro ao atribuir tarefa no Supabase. Verifique os campos.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{ content: 'max-w-xl sm:max-w-lg' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          {{ isGestorOrAdmin ? 'Atribuir Nova Tarefa' : 'Nova Tarefa Pessoal' }}
        </h2>
        <button
          type="button"
          class="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          @click="closeModal"
        >
          <UIcon name="i-heroicons-x-mark" class="size-5" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Banner informativo dinâmico -->
        <div
          class="flex items-center gap-3 rounded-xl px-4 py-3"
          :class="isGestorOrAdmin ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-violet-50 dark:bg-violet-950/30'"
        >
          <UIcon
            :name="isGestorOrAdmin ? 'i-heroicons-user-group' : 'i-heroicons-user-circle'"
            class="size-5 shrink-0"
            :class="isGestorOrAdmin ? 'text-amber-500' : 'text-violet-500'"
          />
          <p class="text-sm text-slate-600 dark:text-slate-300">
            <template v-if="isGestorOrAdmin">
              Você está criando uma tarefa corporativa e atribuindo ao <strong class="text-amber-600 dark:text-amber-400">colaborador selecionado</strong>.
            </template>
            <template v-else>
              Esta tarefa é pessoal e ficará visível <strong class="text-violet-600 dark:text-violet-400">apenas para você</strong>.
            </template>
          </p>
        </div>

        <!-- Alerta de Erro -->
        <div
          v-if="errorMessage"
          class="p-3 bg-rose-100 border border-rose-400 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Separador -->
        <hr class="border-slate-100 dark:border-slate-800" />

        <!-- Informações Gerais -->
        <section class="space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Informações da Tarefa</h3>

          <!-- Seleção de Projeto e Colaborador (apenas para Gestor/Admin) -->
          <div v-if="isGestorOrAdmin" class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Projeto <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="selectedProject"
                  class="w-full h-[38px] appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option v-for="proj in availableProjects" :key="proj.id" :value="proj.id">
                    {{ proj.name }}
                  </option>
                </select>
                <UIcon name="i-heroicons-chevron-down" class="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Colaborador Responsável <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="selectedAssignee"
                  class="w-full h-[38px] appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option v-for="user in availableAssignees" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
                <UIcon name="i-heroicons-chevron-down" class="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- Título -->
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Título da Tarefa <span class="text-rose-500">*</span>
            </label>
            <UInput
              v-model="title"
              placeholder="Ex: Criar protótipo da dashboard"
              class="w-full"
              :class="{ 'ring-1 ring-rose-400 rounded-lg': errors.title }"
              :disabled="isSubmitting"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-rose-500">Campo obrigatório</p>
          </div>

          <!-- Descrição -->
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Descrição
            </label>
            <div class="relative">
              <UTextarea
                v-model="description"
                :rows="4"
                placeholder="Descreva o que precisa ser feito, objetivos e detalhes importantes..."
                class="w-full"
                :maxlength="1000"
                :disabled="isSubmitting"
              />
              <span class="absolute bottom-2 right-3 text-xs text-slate-400">
                {{ description.length }}/1000
              </span>
            </div>
          </div>

          <!-- Prioridade + Prazo Final -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Prioridade <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="priority"
                  class="w-full h-[38px] appearance-none rounded-lg border px-3 pr-8 text-sm outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 dark:bg-slate-900 dark:text-slate-200"
                  :class="errors.priority
                    ? 'border-rose-400 bg-rose-50/50 text-slate-700 dark:border-rose-500'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700'"
                  :disabled="isSubmitting"
                >
                  <option value="" disabled>Selecione a prioridade</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
                <UIcon name="i-heroicons-chevron-down" class="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p v-if="errors.priority" class="mt-1 text-xs text-rose-500">Selecione a prioridade</p>
              <!-- Pills de prioridade -->
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="p in priorityPills"
                  :key="p.value"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors"
                  :class="priority === p.value
                    ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'"
                  @click="priority = p.value"
                >
                  <span class="size-2.5 rounded-full" :class="p.dot" />
                  {{ p.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Prazo Final <span class="text-rose-500">*</span>
              </label>
              <UInput
                v-model="deadline"
                type="date"
                icon="i-heroicons-calendar-days"
                class="w-full"
                :class="{ 'ring-1 ring-rose-400 rounded-lg': errors.deadline || errors.deadlinePast }"
                :min="todayISO"
                :disabled="isSubmitting"
              />
              <p v-if="errors.deadline" class="mt-1 text-xs text-rose-500">Campo obrigatório</p>
              <p v-else-if="errors.deadlinePast" class="mt-1 text-xs text-rose-500">A data deve ser hoje ou futura</p>
            </div>
          </div>
        </section>

        <!-- Subtarefas -->
        <section class="space-y-3">
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Subtarefas</h3>

          <!-- Input de subtarefa -->
          <div class="relative">
            <UInput
              v-model="subtaskInput"
              placeholder="Adicionar uma subtarefa..."
              class="w-full"
              :disabled="isSubmitting"
              @keydown="onSubtaskKeydown"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              @click="addSubtask"
            >
              <UIcon name="i-heroicons-plus" class="size-4" />
            </button>
          </div>

          <!-- Lista de subtarefas -->
          <div v-if="subtasks.length === 0" class="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-8 dark:bg-slate-800/50">
            <UIcon name="i-heroicons-clipboard-document-list" class="size-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma subtarefa adicionada</p>
          </div>

          <ul v-else class="space-y-1.5">
            <li
              v-for="(st, i) in subtasks"
              :key="st + '-' + i"
              draggable="true"
              @dragstart="onDragStart(i, $event)"
              @dragenter.prevent="onDragEnter(i)"
              @dragover.prevent
              @dragend="onDragEnd"
              class="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 transition-all cursor-move hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              :class="{ 'opacity-50': draggedIndex === i }"
            >
              <UIcon name="i-heroicons-bars-2" class="size-4 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing" />
              <input 
                v-model="subtasks[i]" 
                type="text"
                class="flex-1 bg-transparent text-sm text-slate-700 outline-none border-b border-transparent focus:border-amber-500 hover:border-slate-200 transition-colors dark:text-slate-200" 
              />
              <button type="button" class="text-slate-300 hover:text-rose-500 transition-colors" @click="removeSubtask(i)">
                <UIcon name="i-heroicons-x-mark" class="size-3.5" />
              </button>
            </li>
          </ul>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full gap-3">
        <button
          type="button"
          class="flex-1 h-[42px] rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="closeModal"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="flex-1 h-[42px] rounded-lg bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 flex items-center justify-center gap-2"
          :class="isSubmitting && 'opacity-50 pointer-events-none cursor-not-allowed'"
          :disabled="isSubmitting"
          @click="createTask"
        >
          <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="size-4 animate-spin" />
          <span>{{ isGestorOrAdmin ? 'Atribuir Tarefa' : 'Criar Tarefa Pessoal' }}</span>
        </button>
      </div>
    </template>
  </UModal>
</template>
