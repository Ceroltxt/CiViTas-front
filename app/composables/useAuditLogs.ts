import type { AuditLog } from '~/types'
import { auditLogsSchema } from '~/schemas'
import { mockAuditLogs } from '~/mocks'

// Backend: `fetchAuditLogs(count)` em `~/services`.
export function useAuditLogs(count = 10): AuditLog[] {
  return auditLogsSchema.parse(mockAuditLogs(count), 'auditLogs')
}
