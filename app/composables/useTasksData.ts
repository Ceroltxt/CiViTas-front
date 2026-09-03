import type { PriorityKey, Task } from '~/types'
import { tasksSchema } from '~/schemas'
import { mockTasks } from '~/mocks'
import { mockProjects } from '~/mocks'
import { ref, watch } from 'vue'
import { ENDPOINTS } from '~/services/endpoints'

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

export function isPersonalTaskOverdue(task: Task, referenceDate = new Date()): boolean {
  if (!task.personal || !task.dueDate || task.status === 'concluido') return false
  const [dayText, monthText] = task.dueDate.trim().split(/\s+/)
  const month = MONTHS_SHORT.findIndex((item) => item.toLowerCase() === monthText?.slice(0, 3).toLowerCase())
  const day = Number(dayText)
  if (!Number.isInteger(day) || month === -1) return false

  const dueDate = new Date(referenceDate.getFullYear(), month, day)
  dueDate.setHours(0, 0, 0, 0)
  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  return dueDate < today
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

export async function updateTaskInSupabase(taskId: string, payload: { nome?: string; descricao?: string; prioridade?: string; data_prazo?: string }): Promise<boolean> {
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    if (!authToken.value) return false

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${authToken.value}`,
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

    fetchTasksFromSupabase(true)
    return true
  } catch (e) {
    console.error('Erro ao atualizar tarefa no Supabase:', e)
    return false
  }
}

export async function deleteTaskFromSupabase(taskId: string): Promise<boolean> {
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    if (!authToken.value) return false

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${authToken.value}`,
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

    fetchTasksFromSupabase(true)
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

const initialMockTasks = tasksSchema.parse(mockTasks, 'tasks')
const savedPersonalTasks = readStoredPersonalTasks(STORAGE_KEY)
const savedWorkTasks = readStoredPersonalTasks(WORK_TASKS_STORAGE_KEY)
const defaultWorkTasks = initialMockTasks.filter((task) => !task.personal)
const workTasks = savedWorkTasks ?? defaultWorkTasks
const defaultPersonalTasks = initialMockTasks.filter((task) => task.personal).map(normalizePersonalTask)

const personalTasks = savedPersonalTasks !== null
  ? savedPersonalTasks.map(normalizePersonalTask)
  : defaultPersonalTasks

const tasksRef = ref<Task[]>([])

if (typeof window !== 'undefined') {
  watch(tasksRef, (tasks) => saveWorkTasks(tasks), { deep: true })
}

let isFetching = false
let hasFetchedInitial = false

/** Busca a lista real de tarefas no banco de dados do Supabase. */
export async function fetchTasksFromSupabase(force = false): Promise<void> {
  if (typeof window === 'undefined') return
  if (isFetching) return
  if (hasFetchedInitial && !force) return

  isFetching = true
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    if (!authToken.value) return

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${authToken.value}`,
    }

    const res = await $fetch<any>(ENDPOINTS.tasks, { baseURL, headers })
    const list = Array.isArray(res) ? res : res?.data
    if (Array.isArray(list)) {
      tasksRef.value = list
      hasFetchedInitial = true
    }
  } catch (e) {
    console.error('Erro ao buscar tarefas do Supabase:', e)
  } finally {
    isFetching = false
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
  fetchTasksFromSupabase(true)
}
