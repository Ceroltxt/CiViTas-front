import type { NavItem } from '~/types'

/** Perfis de rota do app (prefixo em `app/pages`). */
export type AppRole = 'colaborador' | 'gestor' | 'admin'

const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  colaborador: [
    { label: 'Início', icon: 'i-heroicons-home', to: '/colaborador' },
    { label: 'Minhas Tarefas', icon: 'i-heroicons-clipboard-document-list', to: '/colaborador/minhas-tarefas' },
    { label: 'Quadros', icon: 'i-heroicons-squares-2x2', to: '/colaborador/quadros' },
    { label: 'Calendário', icon: 'i-heroicons-calendar-days', to: '/colaborador/calendario' },
    { label: 'Relatórios', icon: 'i-heroicons-document-chart-bar', to: '/colaborador/relatorios' },
    { label: 'Configurações', icon: 'i-heroicons-cog-6-tooth', to: '/colaborador/configuracoes' },
  ],
  gestor: [
    { label: 'Início', icon: 'i-heroicons-home', to: '/gestor' },
    { label: 'Quadros', icon: 'i-heroicons-squares-2x2', to: '/gestor/quadros' },
    { label: 'Calendário', icon: 'i-heroicons-calendar-days', to: '/gestor/calendario' },
    { label: 'Equipes', icon: 'i-heroicons-user-group', to: '/gestor/equipes' },
    { label: 'Relatórios', icon: 'i-heroicons-document-chart-bar', to: '/gestor/relatorios' },
    { label: 'Configurações', icon: 'i-heroicons-cog-6-tooth', to: '/gestor/configuracoes' },
  ],
  admin: [
    { label: 'Início', icon: 'i-heroicons-home', to: '/admin/dashboard' },
    { label: 'Kanban', icon: 'i-heroicons-squares-2x2', to: '/admin/kanban' },
    { label: 'Timeline', icon: 'i-heroicons-queue-list', to: '/admin/timeline' },
    { label: 'Projetos', icon: 'i-heroicons-folder', to: '/admin/projetos' },
    { label: 'Acessos', icon: 'i-heroicons-key', to: '/admin/acessos' },
    { label: 'Auditoria', icon: 'i-heroicons-shield-check', to: '/admin/auditoria' },
  ],
}

/** Converte o rótulo de perfil da API/mock para o prefixo de rotas. */
export function resolveAppRole(role?: string): AppRole {
  const normalized = role?.toLowerCase().trim() ?? ''
  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('gestor')) return 'gestor'
  return 'colaborador'
}

/** Rota inicial após login ou clique na marca. */
export function getHomePath(appRole: AppRole): string {
  return NAV_BY_ROLE[appRole][0].to
}

/** Itens do menu lateral para o perfil. */
export function getNavigationForRole(appRole: AppRole): NavItem[] {
  return NAV_BY_ROLE[appRole]
}
