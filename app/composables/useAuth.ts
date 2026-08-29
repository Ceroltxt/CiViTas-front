import { useState, useCookie, navigateTo, useRuntimeConfig } from '#imports'
import { ENDPOINTS } from '~/services/endpoints'
import { useApi } from '~/services/http'

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
    return '/colaborador'
  }

  async function login(emailVal: string, passwordVal: string): Promise<{ success: boolean; targetRoute?: string; error?: string }> {
    isLoading.value = true
    errorMessage.value = null

    try {
      const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'

      const res = await $fetch<LoginResponse>(ENDPOINTS.login, {
        method: 'POST',
        baseURL,
        body: { email: emailVal, password: passwordVal, device_name: 'civitas-web' },
        headers: { Accept: 'application/json' },
      })

      if (res && res.token) {
        tokenCookie.value = res.token
        userState.value = res.funcionario

        const role = res.funcionario.app_role || res.funcionario.cargo?.nome || 'colaborador'
        const targetRoute = resolveRoleRoute(role)

        isLoading.value = false
        return { success: true, targetRoute }
      }

      throw new Error('Resposta inválida do servidor de autenticação.')
    } catch (err: any) {
      isLoading.value = false
      const rawMessage = err?.data?.message || err?.response?._data?.message || err?.message
      const message = rawMessage && typeof rawMessage === 'string' && !rawMessage.includes('FetchError')
        ? rawMessage
        : 'E-mail ou senha incorretos. Verifique suas credenciais.'
      errorMessage.value = message
      return { success: false, error: message }
    }
  }

  async function logout() {
    try {
      if (tokenCookie.value) {
        await api.post(ENDPOINTS.logout, {})
      }
    } catch (e) {
      // Ignorar erros no logout
    } finally {
      tokenCookie.value = null
      userState.value = null
      await navigateTo('/login')
    }
  }

  async function fetchUser(): Promise<AuthFuncionario | null> {
    if (!tokenCookie.value) {
      return userState.value
    }
    try {
      const res = await api.get<AuthFuncionario>(
        ENDPOINTS.meAuth,
        undefined as any,
        () => (userState.value || { matricula: '0', nome: 'Usuário', email: '' })
      )
      userState.value = res
      return res
    } catch (e) {
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
