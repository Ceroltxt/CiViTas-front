import type { ProjectProgress } from '~/types'
import { useDashboardApi } from '~/composables/useDashboardApi'
import { getAuthToken } from '~/composables/useTasksData'
import { ENDPOINTS } from '~/services/endpoints'
import { ref } from 'vue'

const userProjectsRef = ref<ProjectProgress[]>([])
let isFetchingUserProjects = false

export async function fetchUserProjectsFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return
  if (isFetchingUserProjects) return

  isFetchingUserProjects = true
  try {
    const dashboardApi = useDashboardApi()
    const projects = await dashboardApi.fetchProjects()
    if (Array.isArray(projects)) {
      userProjectsRef.value = projects.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color || 'bg-violet-500',
        progress: p.progress || 0,
        completedTasks: 0,
        totalTasks: 0,
        teams: p.teams || [],
      }))
    }
  } catch (e) {
    console.error('Erro ao buscar projetos do usuário no Supabase:', e)
  } finally {
    isFetchingUserProjects = false
  }
}

export async function createProjectInSupabase(payload: { nome: string; descricao?: string; prioridade?: string; data_inicio?: string; data_previsao_fim?: string }): Promise<boolean> {
  try {
    const config = useRuntimeConfig()
    const token = getAuthToken()
    if (!token) return false

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }

    await $fetch<any>('/projects', {
      method: 'POST',
      baseURL,
      headers,
      body: payload,
    })

    fetchUserProjectsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao criar projeto no Supabase:', e)
    return false
  }
}

export async function updateProjectInSupabase(id: string, payload: { nome?: string; descricao?: string; prioridade?: string }): Promise<boolean> {
  try {
    const config = useRuntimeConfig()
    const token = getAuthToken()
    if (!token) return false

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }

    await $fetch<any>(`/projects/${id}`, {
      method: 'PUT',
      baseURL,
      headers,
      body: payload,
    })

    fetchUserProjectsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao atualizar projeto no Supabase:', e)
    return false
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  try {
    const config = useRuntimeConfig()
    const token = getAuthToken()
    if (!token) return false

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }

    await $fetch(`/projects/${id}`, {
      method: 'DELETE',
      baseURL,
      headers,
    })

    fetchUserProjectsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao excluir projeto no Supabase:', e)
    return false
  }
}

/** Projetos em que o colaborador/gestor está envolvido. */
export function useUserProjects(): ProjectProgress[] {
  if (typeof window !== 'undefined') {
    fetchUserProjectsFromSupabase()
  }
  return userProjectsRef.value
}
