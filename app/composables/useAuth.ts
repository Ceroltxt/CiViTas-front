import { useState, useCookie, navigateTo, useRuntimeConfig } from '#imports'
import { ENDPOINTS } from '~/services/endpoints'
import { useApi } from '~/services/http'
import { clearTasksState, fetchTasksFromSupabase } from '~/composables/useTasksData'
import { clearProjectsState } from '~/composables/useUserProjects'

export interface AuthFuncionario {
  matricula: string | number
  nome: string
  sobrenome?: string
  email: string
  pontos_totais?: number
  app_role?: 'admin' | 'gestor' | 'colaborador' | string
  role_label?: string
  cargo?: {
    id?: number | string
    nome?: string
  }
  departamento?: {
    id?: number | string
    nome?: string
  }
}

export interface LoginResponse {
  token: string
  token_type: string
  funcionario: AuthFuncionario
}

export function useAuth() {
  const api = useApi()
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    sameSite: 'lax',
  })
  const userState = useState<AuthFuncionario | null>('auth_user', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)
  const errorMessage = useState<string | null>('auth_error', () => null)

  function resolveRoleRoute(role?: string): string {
    const normalized = (role || '').toLowerCase().trim()
    if (normalized === 'admin' || normalized === 'administrador') {
      return '/admin'
    }
    if (normalized === 'gestor') {
      return '/gestor'
    }
    if (normalized === 'colaborador') {
      return '/colaborador'
    }
    return '/login'
  }

  async function login(emailVal: string, passwordVal: string): Promise<{ success: boolean; targetRoute?: string; error?: string }> {
    isLoading.value = true
    errorMessage.value = null

    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'

      // --- MOCK LOGIN PARA DESENVOLVIMENTO (SEM BACKEND) ---
      // Caso não haja backend rodando, você pode usar esses emails de teste
      if (emailVal.endsWith('@civitas.test') && passwordVal === '123456') {
        const mockRoles: Record<string, string> = {
          'admin@civitas.test': 'admin',
          'gestor@civitas.test': 'gestor',
          'colaborador@civitas.test': 'colaborador'
        }
        const role = mockRoles[emailVal]
        
        if (role) {
          const mockUser: AuthFuncionario = {
            matricula: 'MOCK-001',
            nome: role.charAt(0).toUpperCase() + role.slice(1) + ' Teste',
            email: emailVal,
            app_role: role
          }
          
          // Simulando o delay da rede
          await new Promise(resolve => setTimeout(resolve, 500))

          tokenCookie.value = 'mock-token-jwt-fake-' + role
          userState.value = mockUser
          
          const targetRoute = resolveRoleRoute(role)
          isLoading.value = false
          return { success: true, targetRoute }
        }
      }
      // ------------------------------------------------------

      const res = await $fetch<LoginResponse>(ENDPOINTS.login, {
        method: 'POST',
        baseURL,
        body: { email: emailVal, password: passwordVal, device_name: 'civitas-web' },
        headers: { Accept: 'application/json' },
      })

      if (res && res.token) {
        tokenCookie.value = res.token
        userState.value = res.funcionario
        clearTasksState()
        fetchTasksFromSupabase(true)

        const role = res.funcionario.app_role || res.funcionario.cargo?.nome || 'colaborador'
        const targetRoute = resolveRoleRoute(role)

        isLoading.value = false
        return { success: true, targetRoute }
      }

      throw new Error('Resposta inválida do servidor de autenticação.')
    } catch (err: any) {
      isLoading.value = false
      const message = 'Usuário não existente ou e-mail/senha incorretos.'
      errorMessage.value = message
      return { success: false, error: message }
    }
  }

  async function logout() {
    try {
      if (tokenCookie.value) {
        const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
        await $fetch(ENDPOINTS.logout, {
          method: 'POST',
          baseURL,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${tokenCookie.value}`,
          },
        })
      }
    } catch (e) {
      // Ignorar erros no logout
    } finally {
      clearTasksState()
      clearProjectsState()
      tokenCookie.value = null
      userState.value = null
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
      await navigateTo('/login')
    }
  }

  async function fetchUser(): Promise<AuthFuncionario | null> {
    if (!tokenCookie.value) {
      return userState.value
    }
    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
      const res = await $fetch<any>(ENDPOINTS.meAuth, {
        baseURL,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      })
      if (res) {
        // /auth/me devolve { id, name, role } — normalizar para o formato interno
        const rawRole = res.app_role || res.role || res.cargo?.nome || 'colaborador'
        const app_role = String(rawRole).toLowerCase().trim()
        userState.value = {
          matricula: res.id || res.matricula || '0',
          nome: res.name || res.nome || 'Usuário',
          email: res.email || '',
          app_role,
          role_label: res.role || res.role_label || app_role,
          cargo: res.cargo || { id: 0, nome: app_role },
          ...res,
        }
      }
      return userState.value
    } catch (e) {
      // Token inválido/expirado — retornar null para o middleware poder limpar
      return null
    }
  }

  return {
    token: tokenCookie,
    user: userState,
    isLoading,
    errorMessage,
    login,
    logout,
    fetchUser,
    resolveRoleRoute,
  }
}
