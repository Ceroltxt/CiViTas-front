import { notificationsSchema } from '~/schemas'
import { mockNotifications } from '~/mocks'

// Backend: `fetchNotifications()` em `~/services`.
const items = notificationsSchema.parse(mockNotifications, 'notifications')

/**
 * Fonte única de notificações do app — consumida tanto pelo sininho da
 * header quanto pelo card de Notificações da home (sem duplicar dados).
 */
export function useNotifications() {
  const unreadCount = computed(() => items.filter((n) => n.unread).length)

  return { items, unreadCount }
}
