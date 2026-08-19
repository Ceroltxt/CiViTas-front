/**
 * Contrato de dados do app (schemas de validação).
 *
 * Cada schema descreve o formato exato que o backend precisa devolver no
 * endpoint correspondente (veja `~/services/endpoints`). Os mesmos schemas são
 * usados para validar tanto as respostas reais da API quanto os dados mock,
 * garantindo que ambos sigam o mesmo contrato.
 *
 * `satisfies Schema<Tipo>` amarra cada schema à interface de `~/types`, então
 * qualquer divergência entre o contrato e os tipos vira erro de compilação.
 */
import { v, type Schema } from '~/utils/validation'
import type {
  AgendaItem,
  AuditLog,
  CalendarEvent,
  CurrentProject,
  DashboardMetric,
  NavItem,
  NotificationItem,
  ProjectDetail,
  ProjectProgress,
  RankingEntry,
  Subtask,
  Task,
  TaskAuditEntry,
  TeamDetail,
  TeamProject,
  TeamRecentTask,
  TeamSummary,
  TimelineGroup,
  TimelineTask,
  UserSummary,
} from '~/types'

export const userSummarySchema = v.object({
  id: v.string(),
  name: v.string(),
  role: v.optional(v.string()),
  avatar: v.optional(v.string()),
}) satisfies Schema<UserSummary>

export const currentProjectSchema = v.object({
  name: v.string(),
  deadline: v.string(),
  progress: v.number(),
}) satisfies Schema<CurrentProject>

export const navItemSchema = v.object({
  label: v.string(),
  icon: v.string(),
  to: v.string(),
}) satisfies Schema<NavItem>

export const prioritySchema = v.enum('critica', 'alta', 'media', 'baixa')

export const statusSchema = v.enum(
  'a-fazer',
  'em-andamento',
  'em-revisao',
  'validar',
  'bloqueado',
  'atrasado',
  'concluido',
  'pausado',
  'cancelado',
)

export const projectDetailSchema = v.object({
  name: v.string(),
  deadline: v.string(),
  progress: v.number(),
  description: v.string(),
  daysRemaining: v.number(),
  totalTasks: v.number(),
  priority: prioritySchema,
  taskStatus: v.object({
    completed: v.number(),
    inProgress: v.number(),
    pending: v.number(),
  }),
  progressTimeline: v.array(v.object({
    month: v.string(),
    value: v.number(),
  })),
}) satisfies Schema<ProjectDetail>

export const subtaskSchema = v.object({
  id: v.string(),
  title: v.string(),
  completed: v.boolean(),
  assignee: v.optional(userSummarySchema),
  dueDate: v.optional(v.string()),
}) satisfies Schema<Subtask>

export const taskAuditEntrySchema = v.object({
  id: v.string(),
  icon: v.string(),
  message: v.string(),
  user: v.string(),
  timestamp: v.string(),
}) satisfies Schema<TaskAuditEntry>

export const taskSchema = v.object({
  id: v.string(),
  title: v.string(),
  priority: prioritySchema,
  status: statusSchema,
  project: v.optional(v.string()),
  team: v.optional(v.string()),
  dueDate: v.optional(v.string()),
  projectProgress: v.optional(v.number()),
  progress: v.optional(v.number()),
  assignees: v.array(userSummarySchema),
  note: v.optional(v.string()),
  personal: v.optional(v.boolean()),
  notStarted: v.optional(v.boolean()),
  subtasks: v.optional(v.array(subtaskSchema)),
  auditLog: v.optional(v.array(taskAuditEntrySchema)),
  stars: v.optional(v.number()),
  description: v.optional(v.string()),
  startDate: v.optional(v.string()),
  type: v.optional(v.string()),
  complexity: v.optional(v.string()),
  category: v.optional(v.string()),
  program: v.optional(v.string()),
  completedDate: v.optional(v.string()),
}) satisfies Schema<Task>

export const dashboardMetricSchema = v.object({
  id: v.string(),
  label: v.string(),
  value: v.string(),
}) satisfies Schema<DashboardMetric>

export const agendaItemSchema = v.object({
  id: v.string(),
  time: v.string(),
  title: v.string(),
  description: v.string(),
  dotColor: v.string(),
  tag: v.object({ label: v.string(), color: v.string() }),
  eventId: v.optional(v.string()),
}) satisfies Schema<AgendaItem>

export const userStatsSchema = v.object({
  completedBeforeDeadline: v.number(),
  completedOnTime: v.number(),
  completedLate: v.number(),
  reopened: v.number(),
})

export const rankingEntrySchema = v.object({
  position: v.number(),
  user: userSummarySchema,
  stars: v.number(),
  stats: v.optional(userStatsSchema)
}) satisfies Schema<RankingEntry>

export const projectProgressSchema = v.object({
  id: v.string(),
  name: v.string(),
  progress: v.number(),
  color: v.string(),
}) satisfies Schema<ProjectProgress>

export const teamSummarySchema = v.object({
  id: v.string(),
  name: v.string(),
  initial: v.string(),
  color: v.string(),
  description: v.string(),
  members: v.array(userSummarySchema),
}) satisfies Schema<TeamSummary>

export const teamProjectSchema = v.object({
  name: v.string(),
  description: v.string(),
  status: v.string(),
  startDate: v.string(),
  endDate: v.string(),
}) satisfies Schema<TeamProject>

export const teamRecentTaskSchema = v.object({
  id: v.string(),
  title: v.string(),
  status: statusSchema,
  createdBy: v.string(),
  createdAt: v.string(),
  dueDate: v.string(),
}) satisfies Schema<TeamRecentTask>

export const teamDetailSchema = v.object({
  id: v.string(),
  name: v.string(),
  initial: v.string(),
  color: v.string(),
  description: v.string(),
  members: v.array(userSummarySchema),
  longDescription: v.string(),
  collaboratorCount: v.number(),
  taskCount: v.number(),
  project: teamProjectSchema,
  recentTasks: v.array(teamRecentTaskSchema),
}) satisfies Schema<TeamDetail>

export const notificationSchema = v.object({
  id: v.string(),
  icon: v.string(),
  iconColor: v.string(),
  title: v.string(),
  description: v.string(),
  time: v.string(),
  unread: v.optional(v.boolean()),
}) satisfies Schema<NotificationItem>

export const auditLogSchema = v.object({
  id: v.string(),
  date: v.string(),
  user: v.string(),
  action: v.string(),
  details: v.string(),
  language: v.string(),
}) satisfies Schema<AuditLog>

export const calendarEventSchema = v.object({
  id: v.string(),
  title: v.string(),
  startDay: v.number(),
  length: v.number(),
  color: v.enum('pink', 'blue', 'amber', 'violet', 'green'),
}) satisfies Schema<CalendarEvent>

export const timelineTaskSchema = v.object({
  id: v.string(),
  title: v.string(),
  assignee: userSummarySchema,
  group: v.optional(v.string()),
  startIndex: v.number(),
  span: v.number(),
  color: v.enum('neutral', 'amber', 'blue', 'violet', 'pink'),
}) satisfies Schema<TimelineTask>

export const timelineGroupSchema = v.object({
  title: v.optional(v.string()),
  tasks: v.array(timelineTaskSchema),
}) satisfies Schema<TimelineGroup>

/** Listas (úteis para validar respostas de coleções). */
export const tasksSchema = v.array(taskSchema)
export const navigationSchema = v.array(navItemSchema)
export const notificationsSchema = v.array(notificationSchema)
export const auditLogsSchema = v.array(auditLogSchema)
export const calendarEventsSchema = v.array(calendarEventSchema)
export const timelineGroupsSchema = v.array(timelineGroupSchema)
export const teamDetailsSchema = v.array(teamDetailSchema)
