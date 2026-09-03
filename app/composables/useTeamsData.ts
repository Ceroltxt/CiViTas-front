import type { TeamDetail } from '~/types'
import { getAuthToken } from '~/composables/useTasksData'
import { ENDPOINTS } from '~/services/endpoints'

const teamsRef = ref<TeamDetail[]>([])
let isFetchingTeams = false

export async function fetchTeamsFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return
  if (isFetchingTeams) return

  const token = getAuthToken()
  if (!token) return

  isFetchingTeams = true
  try {
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }

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

export function useTeamsData(): TeamDetail[] {
  if (typeof window !== 'undefined') {
    fetchTeamsFromSupabase()
  }
  return teamsRef.value
}
