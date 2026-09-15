import type { NavItem } from '~/types'

/** Perfis de rota do app (prefixo em `app/pages`). */
export type AppRole = 'colaborador' | 'gestor' | 'admin'

const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  colaborador: [
    { label: 'Início', icon: 'i-heroicons-home', to: '/colaborador' },
    { label: 'Minhas Tarefas', icon: 'i-heroicons-clipboard-document-list', to: '/colaborador/minhas-tarefas' },
    { label: 'Projetos', icon: 'i-heroicons-folder', to: '/colaborador/projetos' },
    { label: 'Ranking', icon: 'i-heroicons-trophy', to: '/colaborador/ranking' },
    { label: 'Relatórios', icon: 'i-heroicons-document-chart-bar', to: '/colaborador/relatorios' },
    { label: 'Configurações', icon: 'i-heroicons-cog-6-tooth', to: '/colaborador/configuracoes' },
  ],
  gestor: [
    { label: 'Dashboard', icon: 'i-heroicons-home', to: '/gestor' },
    { label: 'Minhas Equipes', icon: 'i-heroicons-user-group', to: '/gestor/equipes' },
    { label: 'Projetos', icon: 'i-heroicons-folder', to: '/gestor/projetos' },
    { label: 'Relatórios', icon: 'i-heroicons-chart-bar', to: '/gestor/relatorios' },
    { label: 'Configurações', icon: 'i-heroicons-cog-6-tooth', to: '/gestor/configuracoes' },
  ],
  admin: [
    { label: 'Início', icon: 'i-heroicons-home', to: '/admin' },
    { label: 'Projetos', icon: 'i-heroicons-folder', to: '/admin/projetos' },
    { label: 'Relatórios', icon: 'i-heroicons-chart-bar', to: '/admin/relatorios' },
    { label: 'Acessos', icon: 'i-heroicons-key', to: '/admin/acessos' },
    { label: 'Configurações', icon: 'i-heroicons-cog-6-tooth', to: '/admin/configuracoes' },
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
