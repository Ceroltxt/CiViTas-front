import type { ProjectProgress } from '~/types'
import { useDashboardApi } from '~/composables/useDashboardApi'
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
    if (Array.isArray(projects) && projects.length > 0) {
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

/** Projetos em que o colaborador/gestor está envolvido. */
export function useUserProjects(): ProjectProgress[] {
  if (typeof window !== 'undefined') {
    fetchUserProjectsFromSupabase()
  }
  return userProjectsRef.value
}
