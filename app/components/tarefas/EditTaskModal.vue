<script setup lang="ts">
import type { PriorityKey, Task, Subtask } from '~/types'
import { updateTaskInSupabase, updatePersonalTask, deleteTaskFromSupabase, deletePersonalTask, fetchTasksFromSupabase } from '~/composables/useTasksData'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ task?: Task | null; taskToEdit?: Task | null }>()
const currentTask = computed(() => props.task || props.taskToEdit || null)

const emit = defineEmits<{ updated: []; deleted: [] }>()

const currentUser = useCurrentUser()
const auth = useAuth()
const config = useRuntimeConfig()
const authToken = useCookie<string | null>('auth_token')
import { ENDPOINTS } from '~/services/endpoints'

const isGestorOrAdmin = computed(() => {
  const role = (auth.user.value?.app_role || '').toLowerCase()
  return role === 'gestor' || role === 'admin'
})

interface AssigneeOption {
  id: string
  name: string
  role: string
}

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/* ── Form state ── */
const title = ref('')
const description = ref('')
const priority = ref<PriorityKey>('media')
const deadline = ref('')
const subtaskInput = ref('')
const subtasks = ref<{ id: string; title: string; completed: boolean }[]>([])
const selectedAssignee = ref<string>('')
const availableAssignees = ref<AssigneeOption[]>([])
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const isPersonal = computed(() => !!currentTask.value?.personal)

const priorityPills: { value: PriorityKey; label: string; dot: string }[] = [
  { value: 'baixa', label: 'Baixa', dot: 'bg-emerald-500' },
  { value: 'media', label: 'Média', dot: 'bg-amber-400' },
  { value: 'alta', label: 'Alta', dot: 'bg-rose-500' },
]

/** Converte "30 Set" → "2026-09-30" para o input date */
function dueDateToISO(dueDate?: string): string {
  if (!dueDate) return ''

  // Já é ISO (yyyy-mm-dd)?
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return dueDate

  const parts = dueDate.trim().split(/\s+/)
  if (parts.length < 2) return ''
  const day = Number(parts[0])
  const monthIdx = MONTHS_SHORT.findIndex(m => m.toLowerCase() === parts[1].slice(0, 3).toLowerCase())
  if (!Number.isInteger(day) || monthIdx === -1) return ''
  const year = new Date().getFullYear()
  return `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

watch(currentTask, (task) => {
  if (task) {
    title.value = task.title || ''
    description.value = task.description || ''
    priority.value = task.priority || 'media'
    deadline.value = dueDateToISO(task.dueDate)
    subtasks.value = (task.subtasks || []).map(st => ({
      id: st.id,
      title: st.title,
      completed: st.completed,
    }))
    errorMessage.value = null
  }
}, { immediate: true })

/* ── Assignee display ── */
const assigneeDisplay = computed(() => {
  if (isPersonal.value) {
    return currentUser?.name || 'Você'
  }
  const task = currentTask.value
  if (task?.assignees?.length) {
    return task.assignees.map(a => a.name).join(', ')
  }
  return 'Não atribuído'
})

async function loadSupabaseData() {
  if (isPersonal.value || !isGestorOrAdmin.value) return
  
  try {
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }

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
      if (currentTask.value?.assignees?.[0]) {
        const currentAssigneeId = String(currentTask.value.assignees[0].id)
        if (membersMap.has(currentAssigneeId)) {
          selectedAssignee.value = currentAssigneeId
        } else {
          selectedAssignee.value = fetchedAssignees[0].id
        }
      } else {
        selectedAssignee.value = fetchedAssignees[0].id
      }
    }
  } catch (e) {
    console.error('Erro ao buscar membros no Supabase:', e)
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    loadSupabaseData()
  }
}, { immediate: true })

/* ── Subtasks ── */
function addSubtask() {
  const v = subtaskInput.value.trim()
  if (v) {
    subtasks.value.push({
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: v,
      completed: false,
    })
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

/* ── Drag & Drop ── */
const draggedIndex = ref<number | null>(null)

function onDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDragEnter(index: number) {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  const items = [...subtasks.value]
  const dragged = items[draggedIndex.value]
  items.splice(draggedIndex.value, 1)
  items.splice(index, 0, dragged)
  subtasks.value = items
  draggedIndex.value = index
}

function onDragEnd() {
  draggedIndex.value = null
}

/* ── Save ── */
async function handleSave() {
  if (isSubmitting.value) return
  if (!currentTask.value?.id) return
  if (!title.value.trim()) {
    errorMessage.value = 'O título da tarefa é obrigatório.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    if (isPersonal.value) {
      // Personal task: update locally + Supabase
      const updated: Task = {
        ...currentTask.value,
        title: title.value.trim(),
        description: description.value.trim(),
        priority: priority.value,
        dueDate: formatDueDateForDisplay(deadline.value),
        subtasks: subtasks.value.map(st => ({
          id: st.id,
          title: st.title,
          completed: st.completed,
        })),
      }
      updatePersonalTask(updated)
      const payload = {
        nome: title.value.trim(),
        descricao: description.value.trim(),
        prioridade: priority.value,
        data_prazo: deadline.value,
        subtarefas: subtasks.value, // Send full objects, backend should handle
      }
      
      // Also update in Supabase
      await updateTaskInSupabase(currentTask.value.id, payload)
    } else {
      // Work task: update in Supabase
      const assigneeList = isGestorOrAdmin.value && selectedAssignee.value ? [Number(selectedAssignee.value)] : undefined
      const success = await updateTaskInSupabase(currentTask.value.id, {
        nome: title.value.trim(),
        descricao: description.value.trim(),
        prioridade: priority.value,
        data_prazo: deadline.value,
        subtarefas: subtasks.value,
        matricula_colaborador: assigneeList,
      })
      if (!success) {
        errorMessage.value = 'Erro ao salvar alterações da tarefa.'
        isSubmitting.value = false
        return
      }
      await fetchTasksFromSupabase(true)
    }

    emit('updated')
    closeModal()
  } catch {
    errorMessage.value = 'Erro ao salvar alterações da tarefa.'
  } finally {
    isSubmitting.value = false
  }
}

/* ── Delete ── */
async function handleDelete() {
  if (isSubmitting.value) return
  if (!currentTask.value?.id) return
  if (!confirm('Tem certeza que deseja excluir esta tarefa permanentemente?')) return

  isSubmitting.value = true

  try {
    if (isPersonal.value) {
      deletePersonalTask(currentTask.value.id)
    } else {
      const success = await deleteTaskFromSupabase(currentTask.value.id)
      if (!success) {
        errorMessage.value = 'Erro ao excluir tarefa.'
        isSubmitting.value = false
        return
      }
    }
    emit('deleted')
    closeModal()
  } catch {
    errorMessage.value = 'Erro ao excluir tarefa.'
  } finally {
    isSubmitting.value = false
  }
}

/** "2026-09-30" → "30 Set" */
function formatDueDateForDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const [, m, d] = dateStr.split('-')
  return `${Number(d)} ${MONTHS_SHORT[Number(m) - 1]}`
}

function closeModal() {
  open.value = false
  errorMessage.value = null
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-3xl overflow-hidden rounded-2xl' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <span
            class="grid size-10 place-items-center rounded-xl text-white"
            :class="isPersonal ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gradient-to-br from-amber-500 to-orange-500'"
          >
            <UIcon :name="isPersonal ? 'i-heroicons-user' : 'i-heroicons-pencil-square'" class="size-5" />
          </span>
          <div>
            <h2 class="font-bold text-slate-900 dark:text-slate-100">Editar Tarefa</h2>
            <p class="text-xs text-slate-500">Altere as informações e salve as mudanças.</p>
          </div>
        </div>
        <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="closeModal" />
      </div>
    </template>

    <template #body>
      <!-- Alerta de Erro -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-rose-100 border border-rose-400 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2"
      >
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="grid divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white md:grid-cols-[1.55fr_0.85fr] md:divide-x md:divide-y-0 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-950/40">
        <!-- COLUNA ESQUERDA: Título, Descrição, Subtarefas -->
        <section class="space-y-5 p-5">
          <!-- Título -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Título <span class="text-rose-500">*</span>
            </label>
            <UInput
              v-model="title"
              size="lg"
              class="w-full"
              placeholder="Título da tarefa"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Descrição -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label>
            <UTextarea
              v-model="description"
              :rows="3"
              class="w-full"
              placeholder="Descreva o objetivo e contexto..."
              :maxlength="1000"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Subtarefas -->
          <div>
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Subtarefas</h3>
              <span v-if="subtasks.length" class="text-xs text-slate-400">
                {{ subtasks.filter(s => s.completed).length }}/{{ subtasks.length }} concluídas
              </span>
            </div>

            <div class="flex gap-2">
              <UInput
                v-model="subtaskInput"
                class="flex-1"
                placeholder="Adicionar subtarefa"
                :disabled="isSubmitting"
                @keydown="onSubtaskKeydown"
              />
              <UButton
                variant="outline"
                icon="i-heroicons-plus"
                :disabled="isSubmitting || !subtaskInput.trim()"
                @click="addSubtask"
              />
            </div>

            <!-- Lista de subtarefas existentes -->
            <div v-if="subtasks.length === 0" class="mt-3 flex flex-col items-center justify-center rounded-xl bg-slate-50 py-6 dark:bg-slate-800/50">
              <UIcon name="i-heroicons-clipboard-document-list" class="size-7 text-slate-300 dark:text-slate-600 mb-1.5" />
              <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Nenhuma subtarefa</p>
            </div>

            <ul v-else class="mt-2 space-y-1.5 max-h-[140px] overflow-y-auto scroll-thin">
              <li
                v-for="(st, i) in subtasks"
                :key="st.id"
                draggable="true"
                class="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 transition-all cursor-move hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                :class="{ 'opacity-50': draggedIndex === i }"
                @dragstart="onDragStart(i, $event)"
                @dragenter.prevent="onDragEnter(i)"
                @dragover.prevent
                @dragend="onDragEnd"
              >
                <UIcon name="i-heroicons-bars-2" class="size-4 text-slate-300 shrink-0 cursor-grab active:cursor-grabbing" />
                <UIcon
                  :name="st.completed ? 'i-heroicons-check-circle-solid' : 'i-heroicons-check-circle'"
                  class="size-4 shrink-0 cursor-pointer transition-colors"
                  :class="st.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'"
                  @click="st.completed = !st.completed"
                />
                <input
                  v-model="subtasks[i].title"
                  type="text"
                  class="flex-1 bg-transparent text-sm text-slate-700 outline-none border-b border-transparent focus:border-violet-500 hover:border-slate-200 transition-colors dark:text-slate-200"
                  :class="{ 'line-through text-slate-400': st.completed }"
                />
                <button type="button" class="text-slate-300 hover:text-rose-500 transition-colors shrink-0" @click="removeSubtask(i)">
                  <UIcon name="i-heroicons-x-mark" class="size-3.5" />
                </button>
              </li>
            </ul>
          </div>
        </section>

        <!-- COLUNA DIREITA: Responsável, Prioridade, Prazo -->
        <aside class="space-y-5 bg-slate-50/60 p-5 dark:bg-slate-900/40">
          <!-- Responsável -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Responsável</label>
            <div v-if="isPersonal || !isGestorOrAdmin"
              class="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
              :class="isPersonal ? 'opacity-75 cursor-not-allowed' : ''"
            >
              <UAvatar
                :src="isPersonal ? currentUser?.avatar : currentTask?.assignees?.[0]?.avatar"
                :alt="assigneeDisplay"
                size="2xs"
              />
              <span class="text-sm text-slate-700 dark:text-slate-200 truncate">{{ assigneeDisplay }}</span>
              <UIcon v-if="isPersonal" name="i-heroicons-lock-closed" class="size-3.5 text-slate-400 ml-auto shrink-0" />
            </div>
            <div v-else class="relative">
              <select
                v-model="selectedAssignee"
                class="w-full h-[38px] appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                :disabled="isSubmitting"
              >
                <option v-for="user in availableAssignees" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
              <UIcon name="i-heroicons-chevron-down" class="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p v-if="isPersonal" class="mt-1 text-[11px] text-slate-400">Tarefas pessoais são visíveis apenas para você.</p>
          </div>

          <!-- Status (informativo) -->
          <div v-if="currentTask">
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Status</label>
            <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
              <span
                class="size-2.5 rounded-full shrink-0"
                :class="{
                  'bg-blue-500': currentTask.status === 'a-fazer',
                  'bg-amber-500': currentTask.status === 'em-andamento',
                  'bg-violet-500': currentTask.status === 'em-revisao',
                  'bg-cyan-500': currentTask.status === 'validar',
                  'bg-emerald-500': currentTask.status === 'concluido',
                  'bg-rose-500': currentTask.status === 'atrasado',
                  'bg-red-500': currentTask.status === 'bloqueado',
                  'bg-slate-400': currentTask.status === 'pausado' || currentTask.status === 'cancelado',
                }"
              />
              <span class="text-sm text-slate-700 dark:text-slate-200 capitalize">
                {{ useStatusMeta(currentTask.status).label }}
              </span>
            </div>
          </div>

          <!-- Prioridade -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prioridade <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in priorityPills"
                :key="p.value"
                type="button"
                class="rounded-lg border px-2 py-2 text-xs font-semibold transition-colors"
                :class="priority === p.value
                  ? 'border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-600'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'"
                :disabled="isSubmitting"
                @click="priority = p.value"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Prazo -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prazo <span class="text-rose-500">*</span>
            </label>
            <UInput
              v-model="deadline"
              type="date"
              icon="i-heroicons-calendar-days"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Projeto (informativo, apenas trabalho) -->
          <div v-if="!isPersonal && currentTask?.project">
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Projeto</label>
            <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
              <span class="size-2.5 rounded-full shrink-0" :class="useProjectDotColor(currentTask.project)" />
              <span class="text-sm text-slate-700 dark:text-slate-200 truncate">{{ currentTask.project }}</span>
            </div>
          </div>
        </aside>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-3">
        <UButton
          color="error"
          variant="ghost"
          icon="i-heroicons-trash"
          label="Excluir"
          size="sm"
          :loading="isSubmitting"
          @click="handleDelete"
        />
        <div class="flex gap-2">
          <UButton color="neutral" variant="outline" label="Cancelar" @click="closeModal" :disabled="isSubmitting" />
          <UButton
            color="primary"
            variant="solid"
            label="Salvar Alterações"
            class="bg-violet-600 hover:bg-violet-700 text-white"
            :loading="isSubmitting"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
