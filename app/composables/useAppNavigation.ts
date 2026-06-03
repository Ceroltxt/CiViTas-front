import type { NavItem } from '~/types'
import { getHomePath, getNavigationForRole, resolveAppRole, type AppRole } from '~/utils/navigation'

/** Menu lateral e rota inicial conforme o perfil do usuário logado. */
export function useAppNavigation() {
  const user = useCurrentUser()
  const appRole = computed<AppRole>(() => resolveAppRole(user.role))
  const homePath = computed(() => getHomePath(appRole.value))
  const items = computed<NavItem[]>(() => getNavigationForRole(appRole.value))

  return { appRole, homePath, items }
}
