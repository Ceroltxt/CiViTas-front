export interface NavItem {
  label: string
  icon: string
  to: string
}

export interface UserSummary {
  id: string
  name: string
  role?: string
  avatar?: string
}

export interface CurrentProject {
  name: string
  deadline: string
  progress: number
}

export interface ProjectTaskStatusBreakdown {
  completed: number
  inProgress: number
  pending: number
}

export interface ProjectProgressPoint {
  month: string
  value: number
}

export interface ProjectDetail extends CurrentProject {
  description: string
  daysRemaining: number
  totalTasks: number
  priority: PriorityKey
  taskStatus: ProjectTaskStatusBreakdown
  progressTimeline: ProjectProgressPoint[]
}

export type PriorityKey = 'critica' | 'alta' | 'media' | 'baixa'

export type StatusKey =
  | 'a-fazer'
  | 'em-andamento'
  | 'em-revisao'
  | 'validar'
  | 'bloqueado'
  | 'atrasado'
  | 'concluido'
  | 'pausado'
  | 'cancelado'

export interface Subtask {
  id: string
  title: string
  completed: boolean
  assignee?: UserSummary
  dueDate?: string
}

export interface TaskAuditEntry {
  id: string
  icon: string
  message: string
  user: string
  timestamp: string
}

export interface Task {
  id: string
  title: string
  priority: PriorityKey
  status: StatusKey
  project?: string
  team?: string
  dueDate?: string
  /** Progresso do projeto associado (0–100), exibido na barra da linha de tarefa. */
  projectProgress?: number
  /** @deprecated Use projectProgress — mantido para compatibilidade com quadros/kanban. */
  progress?: number
  assignees: UserSummary[]
  note?: string
  /** Tarefa pessoal do colaborador, sem projeto nem equipe. */
  personal?: boolean
  /** Indica tarefa atribuída ainda não iniciada (0% do projeto). */
  notStarted?: boolean
  /** Subtarefas vinculadas a esta tarefa. */
  subtasks?: Subtask[]
  /** Histórico de auditoria da tarefa. */
  auditLog?: TaskAuditEntry[]
  /** Estrelas de avaliação (0–3). */
  stars?: number
  /** Descrição detalhada da tarefa. */
  description?: string
  /** Data de início da tarefa. */
  startDate?: string
  /** Tipo da tarefa (ex: Infraestrutura, Desenvolvimento). */
  type?: string
  /** Complexidade da tarefa (ex: Alta, Média, Baixa). */
  complexity?: string
  /** Categoria da tarefa (ex: Montagem, Revisão). */
  category?: string
  /** Programa ou evento associado (ex: Festa 2026). */
  program?: string
  /** Data em que a tarefa foi concluída (formato DD/MM/YYYY). */
  completedDate?: string
}

export interface TimelineTask {
  id: string
  title: string
  assignee: UserSummary
  group?: string
  /** índice da coluna inicial na régua de datas */
  startIndex: number
  /** duração em colunas */
  span: number
  color: TimelineBarColor
}

export type TimelineBarColor = 'neutral' | 'amber' | 'blue' | 'violet' | 'pink'

export interface CalendarEvent {
  id: string
  title: string
  /** dia do mês (1-31) de início */
  startDay: number
  /** quantos dias o evento ocupa */
  length: number
  color: 'pink' | 'blue' | 'amber' | 'violet' | 'green'
  /** Define se o evento pode ser clicado/editado pelo usuário atual. */
  editable?: boolean
}

export interface DateRange {
  start: Date
  end: Date
}

export interface AgendaItem {
  id: string
  time: string
  title: string
  description: string
  /** classe de cor do marcador na linha do tempo (ex.: "bg-orange-400") */
  dotColor: string
  tag: { label: string; color: string }
  /** ID do evento correspondente no calendário. */
  eventId?: string
}

export interface UserStats {
  completedBeforeDeadline: number
  completedOnTime: number
  completedLate: number
  reopened: number
}

export interface RankingEntry {
  position: number
  user: UserSummary
  stars: number
  stats?: UserStats
}

export interface ProjectTeam {
  id: string
  name: string
  initial: string
  color: string
  role: 'Membro'
  memberCount: number
  projectId: string
  description?: string
  leader?: string
  area?: string
  priority?: string
  createdAt?: string
}

export interface ProjectProgress {
  id: string
  name: string
  progress: number
  color: string
  teams?: ProjectTeam[]
}

export interface TeamSummary {
  id: string
  name: string
  initial: string
  color: string
  description: string
  members: UserSummary[]
}

export interface TeamProject {
  name: string
  description: string
  status: string
  startDate: string
  endDate: string
}

export interface TeamRecentTask {
  id: string
  title: string
  status: StatusKey
  createdBy: string
  createdAt: string
  dueDate: string
}

export interface TeamDetail extends TeamSummary {
  longDescription: string
  collaboratorCount: number
  taskCount: number
  project: TeamProject
  recentTasks: TeamRecentTask[]
}

export interface NotificationItem {
  id: string
  icon: string
  iconColor: string
  title: string
  description: string
  time: string
  unread?: boolean
}

export interface AuditLog {
  id: string
  date: string
  user: string
  action: string
  details: string
  language: string
}

/**
 * Métrica numérica do dashboard (ex.: "Tarefas Atribuídas: 12").
 * Vem do backend; a aparência (ícone/cores) é resolvida no front-end.
 */
export interface DashboardMetric {
  id: string
  label: string
  /** valor já formatado para exibição (ex.: "12", "78%") */
  value: string
}

/** Agregado consumido pela tela inicial (Início). */
export interface InicioOverview {
  metrics: DashboardMetric[]
  agenda: AgendaItem[]
  ranking: RankingEntry[]
  projects: ProjectProgress[]
  teams: TeamSummary[]
}

/** Linha/grupo de tarefas posicionadas na régua de tempo (Gantt). */
export interface TimelineGroup {
  title?: string
  tasks: TimelineTask[]
}
