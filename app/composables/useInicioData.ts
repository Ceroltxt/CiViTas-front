import type {
  AgendaItem,
  DashboardMetric,
  ProjectProgress,
  RankingEntry,
  TeamSummary,
} from '~/types'
import {
  agendaItemSchema,
  dashboardMetricSchema,
  projectProgressSchema,
  rankingEntrySchema,
  teamSummarySchema,
} from '~/schemas'
import { v } from '~/utils/validation'
import {
  mockAgenda,
  mockCurrentUserRank,
  mockDashboardMetrics,
  mockProjects,
  mockRanking,
  mockTeams,
} from '~/mocks'

interface StatCardData {
  id: string
  label: string
  value: string
  icon: string
  iconClass: string
  bgClass: string
}

/**
 * Aparência de cada métrica (ícone/cores) — puramente visual, fica no
 * front-end. Os valores (`label`/`value`) vêm do backend via `DashboardMetric`.
 */
const STAT_PRESENTATION: Record<string, Pick<StatCardData, 'icon' | 'iconClass' | 'bgClass'>> = {
  atribuidas: {
    icon: 'i-heroicons-clipboard-document-list',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30',
  },
  andamento: {
    icon: 'i-heroicons-play',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30',
  },
  atraso: {
    icon: 'i-heroicons-exclamation-triangle',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30',
  },
  produtividade: {
    icon: 'i-heroicons-chart-bar',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30',
  },
}

const FALLBACK_PRESENTATION: Pick<StatCardData, 'icon' | 'iconClass' | 'bgClass'> = {
  icon: 'i-heroicons-chart-bar',
  iconClass: 'text-white',
  bgClass: 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg shadow-slate-500/30',
}

/** Junta a métrica (backend) com sua apresentação (front-end). */
function toStatCard(metric: DashboardMetric): StatCardData {
  return { ...metric, ...(STAT_PRESENTATION[metric.id] ?? FALLBACK_PRESENTATION) }
}

// Backend: `fetchInicioOverview()` em `~/services`.
export function useInicioData() {
  const metrics = v.array(dashboardMetricSchema).parse(mockDashboardMetrics, 'dashboardMetrics')
  const stats: StatCardData[] = metrics.map(toStatCard)

  const agenda: AgendaItem[] = v.array(agendaItemSchema).parse(mockAgenda, 'agenda')
  const ranking: RankingEntry[] = v.array(rankingEntrySchema).parse(mockRanking, 'ranking')
  const currentUserRank: RankingEntry = rankingEntrySchema.parse(mockCurrentUserRank, 'currentUserRank')
  const projects: ProjectProgress[] = v.array(projectProgressSchema).parse(mockProjects, 'projects')
  const teams: TeamSummary[] = v.array(teamSummarySchema).parse(mockTeams, 'teams')

  const { items: notifications } = useNotifications()

  return { stats, agenda, ranking, currentUserRank, projects, teams, notifications }
}
