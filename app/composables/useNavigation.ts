import type { NavItem } from '~/types'

/** Itens do menu lateral principal (por perfil do usuário). */
export function useNavigation(): ComputedRef<NavItem[]> {
  const { items } = useAppNavigation()
  return items
}
