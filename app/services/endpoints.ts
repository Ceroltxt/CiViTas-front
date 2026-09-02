/**
 * Mapa central de endpoints da API.
 *
 * Fonte única dos caminhos consumidos pelo front-end. A URL base vem de
 * `runtimeConfig.public.apiBase` (variável `NUXT_PUBLIC_API_BASE`), então a
 * pessoa de backend só precisa implementar estas rotas e apontar a base.
 */
export const ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  meAuth: '/auth/me',
  currentUser: '/me',
  currentProject: '/me/current-project',
  navigation: '/navigation',
  notifications: '/notifications',
  dashboardMetrics: '/dashboard/metrics',
  agenda: '/dashboard/agenda',
  ranking: '/dashboard/ranking',
  projects: '/dashboard/projects',
  teams: '/teams',
  tasks: '/tasks',
  boardTasks: '/board/tasks',
  timeline: '/board/timeline',
  calendarEvents: '/calendar/events',
  auditLogs: '/audit-logs',
  adminDashboard: '/admin/dashboard',
} as const

export type EndpointKey = keyof typeof ENDPOINTS
