import { useState, useCookie, useRuntimeConfig } from '#imports'
import { getAuthToken } from './useTasksData'

export interface Workspace {
  id: number | string
  nome: string
  role: 'admin' | 'gestor' | 'colaborador' | string
}

export function useWorkspace() {
  const config = useRuntimeConfig()
  
  const workspaces = useState<Workspace[]>('user_workspaces', () => [])
  const activeWorkspaceId = useCookie<string | null>('active_workspace_id', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
  
  const activeWorkspace = computed(() => {
    if (!activeWorkspaceId.value) return null
    return workspaces.value.find(w => String(w.id) === String(activeWorkspaceId.value)) || null
  })

  async function fetchWorkspaces() {
    const token = getAuthToken()
    if (!token) return []

    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    try {
      const data = await $fetch<Workspace[]>('/workspaces', {
        baseURL,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      workspaces.value = data || []
      return data
    } catch (e) {
      console.error('Erro ao buscar workspaces:', e)
      return []
    }
  }

  function selectWorkspace(workspaceId: string | number) {
    activeWorkspaceId.value = String(workspaceId)
  }

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    fetchWorkspaces,
    selectWorkspace
  }
}

export function getWorkspaceHeaders(): Record<string, string> {
  const activeId = useCookie<string | null>('active_workspace_id').value
  if (!activeId) return {}
  return {
    'X-Workspace-Id': String(activeId)
  }
}
