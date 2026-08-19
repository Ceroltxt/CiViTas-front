import type { PriorityKey, Task } from '~/types'
import { tasksSchema } from '~/schemas'
import { mockTasks } from '~/mocks'
import { mockProjects } from '~/mocks'
import { ref } from 'vue'

/** Snapshot local das tarefas pessoais enquanto os endpoints de escrita não existem. */
const STORAGE_KEY = 'civitas-personal-tasks-v2'
const LEGACY_STORAGE_KEY = 'civitas-personal-tasks'
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

/** Uma tarefa concluída não é marcada como atrasada retroativamente. */
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
  // Salva a coleção inteira: assim edições e exclusões dos dados iniciais
  // também sobrevivem ao recarregamento, não só tarefas recém-criadas.
  const personal = tasksRef.value
    .filter((t) => t.personal)
    .map(normalizePersonalTask)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(personal))
}

export function deletePersonalTask(taskId: string): void {
  const idx = tasksRef.value.findIndex(t => t.id === taskId)
  if (idx > -1 && tasksRef.value[idx].personal) {
    tasksRef.value.splice(idx, 1)
    savePersonalTasks()
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
      // O prazo vencido prevalece sobre alterações manuais de status.
      t.status = isPersonalTaskOverdue(t) ? 'atrasado' : status
      changed = true
    }
  })
  if (changed) savePersonalTasks()
}

/** Atualiza a prioridade de várias tarefas pessoais e persiste a alteração. */
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
const legacyPersonalTasks = readStoredPersonalTasks(LEGACY_STORAGE_KEY)
const defaultPersonalTasks = initialMockTasks.filter((task) => task.personal).map(normalizePersonalTask)

// A versão anterior armazenava apenas tarefas novas. Enquanto não existir um
// snapshot completo, combinamos esse legado com os mocks para não perder nada.
const personalTasks = savedPersonalTasks !== null
  ? savedPersonalTasks.map(normalizePersonalTask)
  : [...defaultPersonalTasks, ...(legacyPersonalTasks ?? []).map(normalizePersonalTask)]

const tasksRef = ref<Task[]>([
  ...initialMockTasks.filter((task) => !task.personal),
  ...personalTasks,
])

/** Cor do "chip" de equipe/área. */
export function useTeamTagClass(team?: string): string {
  const map: Record<string, string> = {
    Backend: 'text-blue-600 bg-blue-50',
    Frontend: 'text-indigo-600 bg-indigo-50',
    DevOps: 'text-emerald-600 bg-emerald-50',
  }
  return (team && map[team]) || 'text-slate-600 bg-slate-100'
}

// Backend: `fetchTasks()` em `~/services`.
export function useTasksData(): Task[] {
  return tasksRef.value
}

/** Retorna referência reativa do array de tarefas (para mutação). */
export function useTasksRef() {
  return tasksRef
}

/** Busca tarefa pelo ID. */
export function getTaskById(taskId: string): Task | undefined {
  return tasksRef.value.find((t) => t.id === taskId)
}

/** Calcula progresso (0–100) baseado nas subtarefas concluídas. */
export function getTaskProgress(task: Task): number {
  if (!task.subtasks || task.subtasks.length === 0) return task.progress ?? 0
  const done = task.subtasks.filter((s) => s.completed).length
  return Math.round((done / task.subtasks.length) * 100)
}

/** Alterna o status de uma subtarefa. Se todas ficarem concluídas, muda a tarefa para 'em-revisao'. */
export function toggleSubtask(taskId: string, subtaskId: string): void {
  const task = tasksRef.value.find((t) => t.id === taskId)
  if (!task || !task.subtasks) return

  const subtask = task.subtasks.find((s) => s.id === subtaskId)
  if (!subtask) return

  subtask.completed = !subtask.completed

  // Recalcula progresso
  const done = task.subtasks.filter((s) => s.completed).length
  task.progress = Math.round((done / task.subtasks.length) * 100)

  // Se todas concluídas, a tarefa pessoal vai diretamente para concluída;
  // as tarefas de trabalho mantêm o fluxo de revisão.
  const terminalStatus = ['concluido', 'cancelado', 'pausado']
  if (done === task.subtasks.length && !terminalStatus.includes(task.status)) {
    task.status = task.personal ? 'concluido' : 'em-revisao'
    // Adiciona entrada no audit log
    if (!task.auditLog) task.auditLog = []
    task.auditLog.unshift({
      id: `al-auto-${Date.now()}`,
      icon: 'i-heroicons-arrow-path',
      message: task.personal
        ? 'Todas subtarefas concluídas — status alterado para "Concluído"'
        : 'Todas subtarefas concluídas — status alterado para "Revisão"',
      user: 'Sistema',
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
    })
  }
  // Se desmarcou subtarefa, a tarefa pessoal concluída (ou de trabalho em
  // revisão) retorna para andamento.
  else if (done < task.subtasks.length && (task.status === 'em-revisao' || (task.personal && task.status === 'concluido'))) {
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

  // Adiciona log da ação de subtarefa
  if (!task.auditLog) task.auditLog = []
  task.auditLog.unshift({
    id: `al-st-${Date.now()}`,
    icon: subtask.completed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle',
    message: subtask.completed
      ? `Subtarefa "${subtask.title}" concluída`
      : `Subtarefa "${subtask.title}" reaberta`,
    user: 'Costa Neves',
    timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
  })

  savePersonalTasks()
}

/** Agrupa tarefas por prioridade preservando a ordem alta → média → baixa. */
export function groupTasksByPriority(tasks: Task[]) {
  const order: PriorityKey[] = ['critica', 'alta', 'media', 'baixa']
  return order
    .map((key) => ({ key, tasks: tasks.filter((t) => t.priority === key) }))
    .filter((group) => group.tasks.length > 0)
}

/** Mapa nome do projeto → cor do dot (derivada de mockProjects). */
const PROJECT_DOT_COLORS: Record<string, string> = Object.fromEntries(
  mockProjects.map((p) => [p.name, p.color]),
)

/** Retorna a classe CSS do dot de cor do projeto. */
export function useProjectDotColor(projectName?: string): string {
  if (!projectName) return 'bg-slate-400'
  return PROJECT_DOT_COLORS[projectName] ?? 'bg-slate-400'
}

/** Adiciona uma nova tarefa ao array reativo global e persiste no localStorage. */
export function addTask(task: Task): void {
  tasksRef.value.unshift(task.personal ? normalizePersonalTask(task) : task)
  savePersonalTasks()
}
