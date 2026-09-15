import type { ProjectProgress } from '~/types'
import { getAuthToken } from '~/composables/useTasksData'
import { ref } from 'vue'

// --- Estado global singleton ---
const gestorProjectsRef = ref<ProjectProgress[]>([])
const isLoadingProjects = ref(false)

// Rastreia se já temos dados válidos para o token atual
let lastFetchedToken: string | null = null
let pendingFetch: Promise<void> | null = null

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

/**
 * Busca projetos alocados ao usuário logado via /dashboard/projects.
 * Deduplicada: múltiplas chamadas simultâneas reutilizam o mesmo Promise.
 * Se o token mudou (troca de usuário), força um novo fetch.
 */
export async function fetchUserProjectsFromSupabase(force = false): Promise<void> {
  if (typeof window === 'undefined') return

  const token = getAuthToken()
  if (!token) return

  // Se já temos dados para este token e não é forçado, pular
  if (!force && lastFetchedToken === token && gestorProjectsRef.value.length > 0) {
    return
  }

  // Se já há um fetch em andamento, aguardar o mesmo Promise (sem disparar outro)
  if (pendingFetch) {
    return pendingFetch
  }

  pendingFetch = (async () => {
    isLoadingProjects.value = true
    try {
      const res = await $fetch<any>('/dashboard/projects', {
        baseURL: getBaseURL(),
        headers: getHeaders(),
      })
      const data = Array.isArray(res) ? res : res?.data
      if (Array.isArray(data)) {
        gestorProjectsRef.value = data.map(p => ({
          id: String(p.id),
          // A API de projetos usa campos em português nas rotas de gestão,
          // enquanto o dashboard pode devolvê-los já normalizados.
          name: p.name || p.nome || 'Projeto sem nome',
          color: p.color || 'bg-violet-500',
          progress: Number(p.progress ?? p.progresso ?? 0),
          completedTasks: Number(p.completedTasks ?? p.tarefas_concluidas ?? 0),
          totalTasks: Number(p.totalTasks ?? p.total_tarefas ?? 0),
          teams: p.teams || [],
          description: p.description || p.descricao || '',
          prioridade: p.prioridade || p.priority || 'media',
          data_previsao_fim: p.data_previsao_fim || '',
        }))
        lastFetchedToken = token
      }
    } catch (e) {
      console.error('Erro ao buscar projetos do Supabase:', e)
    } finally {
      isLoadingProjects.value = false
      pendingFetch = null
    }
  })()

  return pendingFetch
}

/** Limpa o cache de projetos (usar no logout). */
export function clearProjectsState(): void {
  gestorProjectsRef.value = []
  lastFetchedToken = null
  pendingFetch = null
}

/** Busca TODOS os projetos (admin) via /projects. */
export async function fetchAllProjectsFromSupabase(): Promise<ProjectProgress[]> {
  try {
    const res = await $fetch<any>('/projects', {
      baseURL: getBaseURL(),
      headers: getHeaders(),
    })
    const data = Array.isArray(res) ? res : res?.data
    if (Array.isArray(data)) {
      return data.map(p => ({
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
  }
  return []
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
    await fetchUserProjectsFromSupabase(true) // força refresh após criar
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
    await fetchUserProjectsFromSupabase(true)
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
    await fetchUserProjectsFromSupabase(true)
    return true
  } catch (e) {
    console.error('Erro ao excluir projeto no Supabase:', e)
    return false
  }
}

/** Retorna array reativo dos projetos do usuário logado. */
export function useUserProjects(): ProjectProgress[] {
  if (typeof window !== 'undefined') {
    fetchUserProjectsFromSupabase()
  }
  return gestorProjectsRef.value
}

/** Ref reativa dos projetos (para computed e v-model). */
export function useGestorProjectsRef() {
  return gestorProjectsRef
}

/** Ref de loading dos projetos. */
export function useProjectsLoading() {
  return isLoadingProjects
}
