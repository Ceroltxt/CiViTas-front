import type {
  AgendaItem,
  ProjectProgress,
  RankingEntry,
  TeamSummary,
} from '~/types'
import {
  agendaItemSchema,
  projectProgressSchema,
  teamSummarySchema,
} from '~/schemas'
import { v } from '~/utils/validation'
import {
  mockAgenda,
  mockProjects,
  mockTeams,
} from '~/mocks'
import { getLeaderboard } from '~/composables/useRankingSystem'

// Backend: `fetchInicioOverview()` em `~/services`.
export function useInicioData() {
  const agenda: AgendaItem[] = v.array(agendaItemSchema).parse(mockAgenda, 'agenda')
  const ranking: RankingEntry[] = getLeaderboard()
  const currentUserRank: RankingEntry = ranking.find(r => r.user.id === 'u-costa') || ranking[ranking.length - 1]
  const projects: ProjectProgress[] = v.array(projectProgressSchema).parse(mockProjects, 'projects')
  const teams: TeamSummary[] = v.array(teamSummarySchema).parse(mockTeams, 'teams')

  const { items: notifications } = useNotifications()

  return { agenda, ranking, currentUserRank, projects, teams, notifications }
}
