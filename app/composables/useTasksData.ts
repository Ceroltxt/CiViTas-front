import type { PriorityKey, Task } from '~/types'
import { mockProjects } from '~/mocks'
import { ref, watch } from 'vue'
import { ENDPOINTS } from '~/services/endpoints'
import { getWorkspaceHeaders } from '~/composables/useWorkspace'

const STORAGE_KEY = 'civitas-personal-tasks-v2'
const WORK_TASKS_STORAGE_KEY = 'civitas-work-tasks-v2'
const PERSONAL_STATUSES = ['a-fazer', 'em-andamento', 'concluido'] as const
export type PersonalTaskStatus = typeof PERSONAL_STATUSES[number]
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function readStoredPersonalTasks(key: string): Task[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const tasks = JSON.parse(raw)
    return Array.isArray(tasks) ? tasks as Task[] : null
  } catch {
    return null
  }
}

export function isTaskOverdue(task: Task, referenceDate = new Date()): boolean {
  if (task.status === 'concluido' || !task.dueDate) return false
  const [dayText, monthText] = task.dueDate.trim().split(/\s+/)
  const month = MONTHS_SHORT.findIndex((item) => item.toLowerCase() === monthText?.slice(0, 3).toLowerCase())
  const day = Number(dayText)
  if (!Number.isInteger(day) || month === -1) return false

  const dueDate = new Date(referenceDate.getFullYear(), month, day, 23, 59, 59)
  return dueDate < referenceDate
}

export function isPersonalTaskOverdue(task: Task, referenceDate = new Date()): boolean {
  if (!task.personal || !task.dueDate || task.status === 'concluido') return false
  return isTaskOverdue(task, referenceDate)
}

function normalizePersonalTask(task: Task): Task {
  const status = PERSONAL_STATUSES.includes(task.status as PersonalTaskStatus)
    ? task.status
    : 'a-fazer'
  const normalized = { ...task, personal: true, status }
  return {
    ...normalized,
    status: isPersonalTaskOverdue(normalized) ? 'atrasado' : normalized.status,
  }
}

function savePersonalTasks(): void {
  if (typeof window === 'undefined') return
  const personal = tasksRef.value
    .filter((t) => t.personal)
    .map(normalizePersonalTask)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(personal))
}

function saveWorkTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(WORK_TASKS_STORAGE_KEY, JSON.stringify(tasks.filter(task => !task.personal)))
}

export function deletePersonalTask(taskId: string): void {
  const idx = tasksRef.value.findIndex(t => t.id === taskId)
  if (idx > -1) {
    tasksRef.value.splice(idx, 1)
  }
  deleteTaskFromSupabase(taskId)
}

export async function updateTaskInSupabase(taskId: string, payload: { nome?: string; descricao?: string; prioridade?: string; data_prazo?: string; subtarefas?: any[]; matricula_colaborador?: number[] }): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) return false

    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...getWorkspaceHeaders()
    }

    const res = await $fetch<any>(`${ENDPOINTS.tasks}/${taskId}`, {
      method: 'PUT',
      baseURL,
      headers,
      body: payload,
    })

    const updated = res?.data || res
    if (updated && updated.id) {
      const idx = tasksRef.value.findIndex(t => String(t.id) === String(taskId))
      if (idx > -1) {
        tasksRef.value[idx] = { ...tasksRef.value[idx], ...updated }
      }
    }
    return true
  } catch (e) {
    console.error('Erro ao atualizar tarefa no Supabase:', e)
    return false
  }
}

export async function updateTaskStatusInSupabase(taskId: string, status: string): Promise<Task | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...getWorkspaceHeaders()
    }

    const res = await $fetch<any>(`${ENDPOINTS.tasks}/${taskId}/status`, {
      method: 'PATCH',
      baseURL,
      headers,
      body: { status },
    })

    const updated = res?.data || res
    if (updated && updated.id) {
      const idx = tasksRef.value.findIndex(t => String(t.id) === String(taskId))
      if (idx > -1) {
        tasksRef.value[idx] = { ...tasksRef.value[idx], ...updated }
      }
      // Se concluiu ou mudou de status, recarrega para manter todos dashboards sincronizados
      return updated
    }
    return null
  } catch (e) {
    console.error('Erro ao atualizar status da tarefa no Supabase:', e)
    return null
  }
}

export async function toggleSubtaskInSupabase(taskId: string, subtaskId: string): Promise<Task | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...getWorkspaceHeaders()
    }

    const res = await $fetch<any>(`${ENDPOINTS.tasks}/${taskId}/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH',
      baseURL,
      headers,
    })

    const updated = res?.data || res
    if (updated && updated.id) {
      const idx = tasksRef.value.findIndex(t => String(t.id) === String(taskId))
      if (idx > -1) {
        tasksRef.value[idx] = { ...tasksRef.value[idx], ...updated }
      }
      return updated
    }
    return null
  } catch (e) {
    console.error('Erro ao alternar subtarefa no Supabase:', e)
    return null
  }
}

export async function deleteTaskFromSupabase(taskId: string): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) return false

    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...getWorkspaceHeaders()
    }

    await $fetch(`${ENDPOINTS.tasks}/${taskId}`, {
      method: 'DELETE',
      baseURL,
      headers,
    })

    const idx = tasksRef.value.findIndex(t => String(t.id) === String(taskId))
    if (idx > -1) {
      tasksRef.value.splice(idx, 1)
    }
    return true
  } catch (e) {
    console.error('Erro ao excluir tarefa no Supabase:', e)
    return false
  }
}

export function updatePersonalTask(updatedTask: Task): void {
  const idx = tasksRef.value.findIndex(t => t.id === updatedTask.id)
  if (idx > -1 && tasksRef.value[idx].personal) {
    tasksRef.value[idx] = normalizePersonalTask(updatedTask)
    savePersonalTasks()
  }
}

export function deletePersonalTasks(taskIds: string[]): void {
  const initialLength = tasksRef.value.length
  tasksRef.value = tasksRef.value.filter(t => !(taskIds.includes(t.id) && t.personal))
  if (tasksRef.value.length !== initialLength) savePersonalTasks()
}

export function updatePersonalTasksStatus(taskIds: string[], status: PersonalTaskStatus): void {
  let changed = false
  tasksRef.value.forEach(t => {
    if (taskIds.includes(t.id) && t.personal) {
      t.status = isPersonalTaskOverdue(t) ? 'atrasado' : status
      changed = true
    }
  })
  if (changed) savePersonalTasks()
}

export function updatePersonalTasksPriority(taskIds: string[], priority: PriorityKey): void {
  let changed = false
  tasksRef.value.forEach(t => {
    if (taskIds.includes(t.id) && t.personal) {
      t.priority = priority
      changed = true
    }
  })
  if (changed) savePersonalTasks()
}

const tasksRef = ref<Task[]>([])
const isLoadingTasksRef = ref(false)

if (typeof window !== 'undefined') {
  watch(tasksRef, (tasks) => saveWorkTasks(tasks), { deep: true })
}

/** Retorna ref reativa de loading de tarefas — use em páginas para exibir skeletons. */
export function useTasksLoading() {
  return isLoadingTasksRef
}

export function getAuthToken(): string | null {
  const cookie = useCookie<string | null>('auth_token')
  if (cookie.value) return cookie.value

  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
    if (match && match[1]) return decodeURIComponent(match[1])
  }

  return null
}

let isFetching = false
let hasFetchedInitial = false

export function clearTasksState(): void {
  tasksRef.value = []
  hasFetchedInitial = false
  isFetching = false
  isLoadingTasksRef.value = false
}

/** Busca a lista real de tarefas no banco de dados do Supabase. */
export async function fetchTasksFromSupabase(force = false): Promise<void> {
  if (typeof window === 'undefined') return
  if (isFetching) return
  if (hasFetchedInitial && !force) return // Evita requisições globais desnecessárias

  const token = getAuthToken()
  if (!token) return

  isFetching = true
  isLoadingTasksRef.value = true
  try {
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...getWorkspaceHeaders()
    }

    const res = await $fetch<any>(ENDPOINTS.tasks, { baseURL, headers })
    const list = Array.isArray(res) ? res : res?.data
    if (Array.isArray(list)) {
      tasksRef.value = list.map((task: Task) => {
        if (task.status !== 'concluido' && (task.status === 'atrasado' || isTaskOverdue(task))) {
          return { ...task, status: 'atrasado' }
        }
        return task
      })
      hasFetchedInitial = true
    }
  } catch (e) {
    console.error('Erro ao buscar tarefas do Supabase:', e)
  } finally {
    isFetching = false
    isLoadingTasksRef.value = false
  }
}

export function useTeamTagClass(team?: string): string {
  const map: Record<string, string> = {
    Backend: 'text-blue-600 bg-blue-50',
    Frontend: 'text-indigo-600 bg-indigo-50',
    DevOps: 'text-emerald-600 bg-emerald-50',
  }
  return (team && map[team]) || 'text-slate-600 bg-slate-100'
}

export function useTasksData(): Task[] {
  if (typeof window !== 'undefined') {
    fetchTasksFromSupabase()
  }
  return tasksRef.value
}

export function useTasksRef() {
  return tasksRef
}

export function getTaskById(taskId: string): Task | undefined {
  return tasksRef.value.find((t) => t.id === taskId)
}

export function getTaskProgress(task: Task): number {
  if (!task.subtasks || task.subtasks.length === 0) return task.progress ?? 0
  const done = task.subtasks.filter((s) => s.completed).length
  return Math.round((done / task.subtasks.length) * 100)
}

export function toggleSubtask(taskId: string, subtaskId: string): void {
  const task = tasksRef.value.find((t) => t.id === taskId)
  if (!task || !task.subtasks) return

  const subtask = task.subtasks.find((s) => s.id === subtaskId)
  if (!subtask) return

  subtask.completed = !subtask.completed

  const done = task.subtasks.filter((s) => s.completed).length
  task.progress = Math.round((done / task.subtasks.length) * 100)

  const terminalStatus = ['concluido', 'cancelado', 'pausado', 'validar']
  if (done === task.subtasks.length && !terminalStatus.includes(task.status)) {
    task.status = task.personal ? 'concluido' : 'validar'
    if (!task.auditLog) task.auditLog = []
    task.auditLog.unshift({
      id: `al-auto-${Date.now()}`,
      icon: 'i-heroicons-arrow-path',
      message: task.personal
        ? 'Todas subtarefas concluídas — status alterado para "Concluído"'
        : 'Todas subtarefas concluídas — aguardando validação do gestor',
      user: 'Sistema',
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
    })
  } else if (done < task.subtasks.length && (task.status === 'validar' || (task.personal && task.status === 'concluido'))) {
    task.status = 'em-andamento'
    if (!task.auditLog) task.auditLog = []
    task.auditLog.unshift({
      id: `al-auto-${Date.now()}`,
      icon: 'i-heroicons-arrow-path',
      message: 'Subtarefa desmarcada — status retornou para "Em andamento"',
      user: 'Sistema',
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
    })
  }

  if (!task.auditLog) task.auditLog = []
  task.auditLog.unshift({
    id: `al-st-${Date.now()}`,
    icon: subtask.completed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle',
    message: subtask.completed
      ? `Subtarefa "${subtask.title}" concluída`
      : `Subtarefa "${subtask.title}" reaberta`,
    user: 'Sistema',
    timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
  })

  savePersonalTasks()
}

export function groupTasksByPriority(tasks: Task[]) {
  const order: PriorityKey[] = ['critica', 'alta', 'media', 'baixa']
  return order
    .map((key) => ({ key, tasks: tasks.filter((t) => t.priority === key) }))
    .filter((group) => group.tasks.length > 0)
}

const PROJECT_DOT_COLORS: Record<string, string> = Object.fromEntries(
  mockProjects.map((p) => [p.name, p.color]),
)

export function useProjectDotColor(projectName?: string): string {
  if (!projectName) return 'bg-slate-400'
  return PROJECT_DOT_COLORS[projectName] ?? 'bg-slate-400'
}

export function addTask(task: Task): void {
  tasksRef.value.unshift(task.personal ? normalizePersonalTask(task) : task)
}
