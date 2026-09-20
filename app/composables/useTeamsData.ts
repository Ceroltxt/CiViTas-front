import type { TeamDetail, UserSummary } from '~/types'
import { getAuthToken } from '~/composables/useTasksData'
import { ENDPOINTS } from '~/services/endpoints'
import { ref } from 'vue'

const teamsRef = ref<TeamDetail[]>([])
let isFetchingTeams = false

function getApiConfig() {
  const config = useRuntimeConfig()
  const token = getAuthToken()
  const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  // Lê o workspace ativo do cookie (mesmo padrão do useApi/http.ts)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)active_workspace_id=([^;]*)/)
    if (match?.[1]) {
      headers['X-Workspace-Id'] = decodeURIComponent(match[1])
    }
  }
  return { baseURL, headers, token }
}

export async function fetchTeamsFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return
  if (isFetchingTeams) return

  const { baseURL, headers, token } = getApiConfig()
  if (!token) return

  isFetchingTeams = true
  try {
    const res = await $fetch<any>(ENDPOINTS.teams, { baseURL, headers })
    const list = Array.isArray(res) ? res : res?.data
    if (Array.isArray(list)) {
      teamsRef.value = list
    }
  } catch (e) {
    console.error('Erro ao buscar equipes do Supabase:', e)
  } finally {
    isFetchingTeams = false
  }
}

export async function fetchGestoresFromSupabase(): Promise<UserSummary[]> {
  try {
    const { baseURL, headers, token } = getApiConfig()
    if (!token) return []

    const res = await $fetch<any>('/gestores', { baseURL, headers })
    const list = Array.isArray(res) ? res : res?.data
    return Array.isArray(list) ? list : []
  } catch (e) {
    console.error('Erro ao buscar gestores do Supabase:', e)
    return []
  }
}

export async function fetchColaboradoresFromSupabase(): Promise<UserSummary[]> {
  try {
    const { baseURL, headers, token } = getApiConfig()
    if (!token) return []

    const res = await $fetch<any>('/colaboradores', { baseURL, headers })
    const list = Array.isArray(res) ? res : res?.data
    return Array.isArray(list) ? list : []
  } catch (e) {
    console.error('Erro ao buscar colaboradores do Supabase:', e)
    return []
  }
}

export async function createTeamInSupabase(payload: { nome: string; matricula_gestor: number; ID_projeto?: number | null; membros?: number[] }): Promise<boolean> {
  try {
    const { baseURL, headers, token } = getApiConfig()
    if (!token) return false

    const res = await $fetch<any>(ENDPOINTS.teams, {
      method: 'POST',
      baseURL,
      headers,
      body: payload,
    })

    const created = res?.data || res
    if (created && created.id) {
      teamsRef.value.unshift(created)
    }

    fetchTeamsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao criar equipe no Supabase:', e)
    return false
  }
}

export async function updateTeamInSupabase(id: string, payload: { nome?: string; matricula_gestor?: number; membros?: number[] }): Promise<boolean> {
  try {
    const { baseURL, headers, token } = getApiConfig()
    if (!token) return false

    await $fetch<any>(`${ENDPOINTS.teams}/${id}`, {
      method: 'PUT',
      baseURL,
      headers,
      body: payload,
    })

    fetchTeamsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao atualizar equipe no Supabase:', e)
    return false
  }
}

export async function deleteTeamFromSupabase(id: string): Promise<boolean> {
  try {
    const { baseURL, headers, token } = getApiConfig()
    if (!token) return false

    await $fetch(`${ENDPOINTS.teams}/${id}`, {
      method: 'DELETE',
      baseURL,
      headers,
    })

    const idx = teamsRef.value.findIndex(t => String(t.id) === String(id))
    if (idx > -1) {
      teamsRef.value.splice(idx, 1)
    }

    fetchTeamsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao excluir equipe no Supabase:', e)
    return false
  }
}

export function useTeamsData(): TeamDetail[] {
  if (typeof window !== 'undefined') {
    fetchTeamsFromSupabase()
  }
  return teamsRef.value
}
