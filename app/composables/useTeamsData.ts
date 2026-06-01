import type { TeamDetail } from '~/types'
import { teamDetailsSchema } from '~/schemas'
import { mockTeamDetails } from '~/mocks'

// Backend: `fetchTeamDetails()` em `~/services`.
export function useTeamsData(): TeamDetail[] {
  return teamDetailsSchema.parse(mockTeamDetails, 'teamDetails')
}
