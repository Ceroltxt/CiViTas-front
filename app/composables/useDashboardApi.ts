import { ENDPOINTS } from '~/services/endpoints'

export interface DashboardMetricItem {
  id: 'atribuidas' | 'andamento' | 'atraso' | 'produtividade' | string
  label: string
  value: string
}

export interface DashboardProjectItem {
  id: string
  name: string
  progress: number
  color: string
  teams?: any[]
}

export interface DashboardRankingItem {
  rank: number
  name: string
  role: string
  points: number
  avatar?: string
}

export function useDashboardApi() {
  const config = useRuntimeConfig()
  const authToken = useCookie<string | null>('auth_token')

  function getHeaders() {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }
    return headers
  }

  async function fetchMetrics(): Promise<DashboardMetricItem[]> {
    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
      const data = await $fetch<DashboardMetricItem[]>(ENDPOINTS.dashboardMetrics, {
        baseURL,
        headers: getHeaders(),
      })
      return Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Erro ao buscar metricas do Dashboard Supabase:', e)
      return []
    }
  }

  async function fetchProjects(): Promise<DashboardProjectItem[]> {
    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
      const res = await $fetch<any>(ENDPOINTS.dashboard.projects, {
        baseURL,
        headers: getHeaders(),
      })
      const data = Array.isArray(res) ? res : res?.data
      return Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Erro ao buscar projetos do Supabase:', e)
      return []
    }
  }

  async function fetchRanking(): Promise<DashboardRankingItem[]> {
    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
      const data = await $fetch<DashboardRankingItem[]>(ENDPOINTS.ranking, {
        baseURL,
        headers: getHeaders(),
      })
      return Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Erro ao buscar ranking do Supabase:', e)
      return []
    }
  }

  async function fetchNotifications(): Promise<any[]> {
    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
      const data = await $fetch<any[]>(ENDPOINTS.notifications, {
        baseURL,
        headers: getHeaders(),
      })
      return Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Erro ao buscar notificacoes do Supabase:', e)
      return []
    }
  }

  return {
    fetchMetrics,
    fetchProjects,
    fetchRanking,
    fetchNotifications,
  }
}
