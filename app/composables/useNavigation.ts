import type { NavItem } from '~/types'
import { navigationSchema } from '~/schemas'
import { mockNavigation } from '~/mocks'

// Backend: `fetchNavigation()` em `~/services`.
const items = navigationSchema.parse(mockNavigation, 'navigation')

/** Itens do menu lateral principal. */
export function useNavigation(): NavItem[] {
  return items
}
