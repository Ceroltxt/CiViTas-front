export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie<string | null>('auth_token')
  const auth = useAuth()

  // Rotas públicas que não requerem autenticação
  const isPublicRoute = to.path === '/login' || to.path === '/cadastro'

  // 1. Se o usuário estiver acessando /login ou /cadastro diretamente, PERMITIR SEMPRE.
  if (isPublicRoute) {
    return
  }

  // 2. Se não houver token e tentar acessar rota protegida, redireciona estritamente para /login
  if (!token.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // 3. Se houver token mas o usuário não estiver na memória, busca na API (/api/me)
  if (token.value && !auth.user.value) {
    const user = await auth.fetchUser()
    // Se a API rejeitar o token (expirado/revogado), limpa os cookies e envia para /login
    if (!user) {
      token.value = null
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
      if (!isPublicRoute) {
        return navigateTo('/login')
      }
      return
    }
  }

  const user = auth.user.value
  const role = (user?.app_role || user?.role || (user as any)?.role_label || '').toLowerCase().trim()

  // 4. Se acessar a raiz (/), redireciona para /ponte ou para /login
  if (to.path === '/') {
    if (token.value && user) {
      return navigateTo('/ponte')
    }
    return navigateTo('/login')
  }

  // 5. Proteção da área /admin (exclusiva para administradores)
  if (to.path.startsWith('/admin')) {
    if (role !== 'admin' && role !== 'administrador') {
      const fallbackRoute = auth.resolveRoleRoute(role)
      return navigateTo(fallbackRoute)
    }
  }

  // 6. Proteção da área /gestor (exclusiva para gestores e administradores)
  if (to.path.startsWith('/gestor')) {
    if (role !== 'gestor' && role !== 'admin' && role !== 'administrador') {
      const fallbackRoute = auth.resolveRoleRoute(role)
      return navigateTo(fallbackRoute)
    }
  }

  // 7. Proteção da área /colaborador (requer role válida de colaborador/gestor/admin)
  if (to.path.startsWith('/colaborador')) {
    if (!role) {
      return navigateTo('/login')
    }
  }
})
