/**
 * Camada de serviços — ponto único de acesso a dados do app.
 *
 * Cada função abaixo busca uma entidade do backend (validando a resposta) e,
 * enquanto não há backend, devolve o mock equivalente. São assíncronas porque
 * representam o formato real de uma chamada de API.
 *
 * ── Como ligar no backend ──────────────────────────────────────────────────
 * 1. Defina `NUXT_PUBLIC_API_BASE` (ex.: https://api.civitas.com) no ambiente.
 * 2. Implemente as rotas listadas em `~/services/endpoints`.
 * 3. Nada mais muda: estas funções passam a chamar a API e validam a resposta.
 *
 * Uso recomendado numa página/componente (com cache e SSR do Nuxt):
 *
 *   const { data: tarefas, pending, error } = await useAsyncData(
 *     'tasks',
 *     () => fetchTasks(),
 *   )
 */
import { ENDPOINTS } from './endpoints'
import { useApi } from './http'
import {
  agendaItemSchema,
  auditLogsSchema,
  calendarEventsSchema,
  currentProjectSchema,
  dashboardMetricSchema,
  navigationSchema,
  notificationsSchema,
  projectProgressSchema,
  rankingEntrySchema,
  tasksSchema,
  teamSummarySchema,
  timelineGroupsSchema,
  userSummarySchema,
} from '~/schemas'
import { v } from '~/utils/validation'
import {
  mockAgenda,
  mockAuditLogs,
  mockBoardTasks,
  mockCalendarEvents,
  mockCurrentProject,
  mockCurrentUser,
  mockDashboardMetrics,
  mockNavigation,
  mockNotifications,
  mockProjects,
  mockRanking,
  mockTasks,
  mockTeams,
  mockTimeline,
} from '~/mocks'
import type { InicioOverview } from '~/types'
import { getNavigationForRole, resolveAppRole } from '~/utils/navigation'

export function fetchCurrentUser() {
  return useApi().get(ENDPOINTS.currentUser, userSummarySchema, () => mockCurrentUser)
}

export function fetchCurrentProject() {
  return useApi().get(ENDPOINTS.currentProject, currentProjectSchema, () => mockCurrentProject)
}

export function fetchNavigation() {
  return useApi().get(ENDPOINTS.navigation, navigationSchema, async () => {
    const user = await fetchCurrentUser()
    return getNavigationForRole(resolveAppRole(user.role))
  })
}

export function fetchNotifications() {
  return useApi().get(ENDPOINTS.notifications, notificationsSchema, () => mockNotifications)
}

export function fetchTasks() {
  return useApi().get(ENDPOINTS.tasks, tasksSchema, () => mockTasks)
}

export function fetchBoardTasks() {
  return useApi().get(ENDPOINTS.boardTasks, tasksSchema, () => mockBoardTasks)
}

export function fetchTimeline() {
  return useApi().get(ENDPOINTS.timeline, timelineGroupsSchema, () => mockTimeline)
}

export function fetchCalendarEvents() {
  return useApi().get(ENDPOINTS.calendarEvents, calendarEventsSchema, () => mockCalendarEvents)
}

export function fetchAuditLogs(count = 10) {
  return useApi().get(ENDPOINTS.auditLogs, auditLogsSchema, () => mockAuditLogs(count), {
    query: { limit: count },
  })
}

/**
 * Agregado da tela inicial. No backend, idealmente um único endpoint
 * (`/dashboard/overview`) devolve tudo; aqui montamos a partir das partes.
 */
export async function fetchInicioOverview(): Promise<InicioOverview> {
  const { get } = useApi()
  const [metrics, agenda, ranking, projects, teams] = await Promise.all([
    get(ENDPOINTS.dashboardMetrics, v.array(dashboardMetricSchema), () => mockDashboardMetrics),
    get(ENDPOINTS.agenda, v.array(agendaItemSchema), () => mockAgenda),
    get(ENDPOINTS.ranking, v.array(rankingEntrySchema), () => mockRanking),
    get(ENDPOINTS.projects, v.array(projectProgressSchema), () => mockProjects),
    get(ENDPOINTS.teams, v.array(teamSummarySchema), () => mockTeams),
  ])
  return { metrics, agenda, ranking, projects, teams }
}
