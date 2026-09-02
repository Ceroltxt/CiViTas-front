import { ref, computed } from 'vue'
import type { AdminDashboardOverview } from '~/types'
import { mockAdminDashboard } from '~/mocks'

export type PeriodKey = 'thisMonth' | 'lastMonth' | 'lastThreeMonths'

const PERIOD_LABELS: Record<PeriodKey, string> = {
  thisMonth: 'Este mês',
  lastMonth: 'Mês passado',
  lastThreeMonths: 'Últimos 3 meses',
}

/**
 * Composable do dashboard ADMIN.
 *
 * Encapsula toda a lógica de dados e filtragem de período.
 * No backend, substitua `mockAdminDashboard` por `await fetchAdminDashboard()`.
 */
export function useAdminDashboard() {
  // Backend: trocar por: const data = await fetchAdminDashboard()
  const data: AdminDashboardOverview = mockAdminDashboard

  const selectedPeriod = ref<PeriodKey>('thisMonth')

  const periodLabel = computed(() => PERIOD_LABELS[selectedPeriod.value])

  const periodOptions = [
    { key: 'thisMonth' as PeriodKey, label: 'Este mês' },
    { key: 'lastMonth' as PeriodKey, label: 'Mês passado' },
    { key: 'lastThreeMonths' as PeriodKey, label: 'Últimos 3 meses' },
  ]

  // --- Dados filtrados pelo período selecionado ---

  const teamPerformance = computed(() => data.teamPerformance[selectedPeriod.value])

  const deliveryPerformance = computed(() => data.deliveryPerformance[selectedPeriod.value])

  const productivityTrend = computed(() => data.productivityTrend[selectedPeriod.value])

  // --- Dados estáticos (não dependem de período) ---
  const metrics = data.metrics
  const collaborators = data.collaborators
  const projectHealth = data.projectHealth
  const risks = data.risks
  const activeProjects = data.activeProjects

  return {
    selectedPeriod,
    periodLabel,
    periodOptions,
    metrics,
    collaborators,
    projectHealth,
    risks,
    activeProjects,
    teamPerformance,
    deliveryPerformance,
    productivityTrend,
  }
}
