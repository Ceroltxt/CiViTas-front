import type { ProjectProgress } from '~/types'
import { getAuthToken } from '~/composables/useTasksData'
import { ref } from 'vue'

// Projetos do gestor logado (filtrado pela API conforme equipe alocada)
const gestorProjectsRef = ref<ProjectProgress[]>([])
// Todos os projetos (para o admin ver tudo)
const allProjectsRef = ref<ProjectProgress[]>([])

let isFetchingGestorProjects = false
let isFetchingAllProjects = false

function getHeaders() {
  const token = getAuthToken()
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function getBaseURL() {
  const config = useRuntimeConfig()
  return (config.public.apiBase as string) || 'http://localhost:8080/api'
}

/** Busca projetos alocados ao gestor/colaborador logado via /dashboard/projects */
export async function fetchUserProjectsFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return
  if (isFetchingGestorProjects) return

  isFetchingGestorProjects = true
  try {
    const res = await $fetch<any>('/dashboard/projects', {
      baseURL: getBaseURL(),
      headers: getHeaders(),
    })
    const data = Array.isArray(res) ? res : res?.data
    if (Array.isArray(data)) {
      gestorProjectsRef.value = data.map(p => ({
        id: String(p.id),
        name: p.name,
        color: p.color || 'bg-violet-500',
        progress: p.progress || 0,
        completedTasks: p.completedTasks || 0,
        totalTasks: p.totalTasks || 0,
        teams: p.teams || [],
      }))
    }
  } catch (e) {
    console.error('Erro ao buscar projetos do gestor no Supabase:', e)
  } finally {
    isFetchingGestorProjects = false
  }
}

/** Busca TODOS os projetos existentes (para admin) via /projects */
export async function fetchAllProjectsFromSupabase(): Promise<ProjectProgress[]> {
  if (isFetchingAllProjects) return allProjectsRef.value
  isFetchingAllProjects = true
  try {
    const res = await $fetch<any>('/projects', {
      baseURL: getBaseURL(),
      headers: getHeaders(),
    })
    const data = Array.isArray(res) ? res : res?.data
    if (Array.isArray(data)) {
      allProjectsRef.value = data.map(p => ({
        id: String(p.id),
        name: p.name,
        color: p.color || 'bg-violet-500',
        progress: p.progress || 0,
        completedTasks: 0,
        totalTasks: 0,
        teams: p.teams || [],
      }))
    }
  } catch (e) {
    console.error('Erro ao buscar todos os projetos no Supabase:', e)
  } finally {
    isFetchingAllProjects = false
  }
  return allProjectsRef.value
}

export async function createProjectInSupabase(payload: {
  nome: string
  descricao?: string
  prioridade?: string
  data_inicio?: string
  data_previsao_fim?: string
  gestores?: number[]
}): Promise<boolean> {
  try {
    await $fetch<any>('/projects', {
      method: 'POST',
      baseURL: getBaseURL(),
      headers: getHeaders(),
      body: payload,
    })
    await fetchUserProjectsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao criar projeto no Supabase:', e)
    return false
  }
}

export async function updateProjectInSupabase(id: string, payload: { nome?: string; descricao?: string; prioridade?: string }): Promise<boolean> {
  try {
    await $fetch<any>(`/projects/${id}`, {
      method: 'PUT',
      baseURL: getBaseURL(),
      headers: getHeaders(),
      body: payload,
    })
    await fetchUserProjectsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao atualizar projeto no Supabase:', e)
    return false
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  try {
    await $fetch(`/projects/${id}`, {
      method: 'DELETE',
      baseURL: getBaseURL(),
      headers: getHeaders(),
    })
    await fetchUserProjectsFromSupabase()
    return true
  } catch (e) {
    console.error('Erro ao excluir projeto no Supabase:', e)
    return false
  }
}

/** Retorna projetos do gestor logado (apenas os que ele está alocado). */
export function useUserProjects(): ProjectProgress[] {
  if (typeof window !== 'undefined') {
    fetchUserProjectsFromSupabase()
  }
  return gestorProjectsRef.value
}

/** Ref reativa dos projetos do gestor (para watch/v-model). */
export function useGestorProjectsRef() {
  return gestorProjectsRef
}
