export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie<string | null>('auth_token')
  const auth = useAuth()

  // Rotas públicas que não requerem autenticação
  const isPublicRoute = to.path === '/login' || to.path === '/cadastro'

  // 1. Se não houver token e tentar acessar rota protegida, redireciona para login
  if (!token.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // 2. Se houver token mas os dados do usuário não estiverem na memória (ex: F5), busca na API
  if (token.value && !auth.user.value) {
    await auth.fetchUser()
  }

  const role = (auth.user.value?.app_role || '').toLowerCase().trim()

  // 3. Se usuário logado tentar acessar a tela de /login, envia para a home do seu perfil
  if (token.value && to.path === '/login') {
    const targetRoute = auth.resolveRoleRoute(role)
    return navigateTo(targetRoute)
  }

  // 4. Proteção da área /admin (exclusiva para administradores)
  if (to.path.startsWith('/admin')) {
    if (role !== 'admin' && role !== 'administrador') {
      const fallbackRoute = auth.resolveRoleRoute(role)
      return navigateTo(fallbackRoute)
    }
  }

  // 5. Proteção da área /gestor (exclusiva para gestores e administradores)
  if (to.path.startsWith('/gestor')) {
    if (role !== 'gestor' && role !== 'admin' && role !== 'administrador') {
      return navigateTo('/colaborador')
    }
  }
})
