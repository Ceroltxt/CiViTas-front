import type { PriorityKey, StatusKey } from '~/types'

interface BadgeMeta {
  label: string
  /** classes utilitárias para o pill (texto + fundo) */
  classes: string
  /** cor do texto isolada (títulos de grupo etc.) */
  text: string
  /** cor do ponto/realce, em classes utilitárias */
  dot: string
  /** cor de borda superior (usado no topo das colunas do kanban) */
  border: string
}

const PRIORITY_META: Record<PriorityKey, BadgeMeta> = {
  critica: {
    label: 'Crítica',
    classes: 'text-red-600 bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    border: 'border-red-400',
  },
  alta: {
    label: 'Alta',
    classes: 'text-pink-600 bg-pink-50',
    text: 'text-pink-600',
    dot: 'bg-pink-500',
    border: 'border-pink-400',
  },
  media: {
    label: 'Média',
    classes: 'text-amber-600 bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    border: 'border-amber-400',
  },
  baixa: {
    label: 'Baixa',
    classes: 'text-emerald-600 bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    border: 'border-emerald-400',
  },
}

const STATUS_META: Record<StatusKey, BadgeMeta> = {
  'a-fazer': {
    label: 'A fazer',
    classes: 'text-blue-600 bg-blue-50 border border-blue-200 dark:bg-blue-900/40 dark:border-blue-700',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    border: 'border-blue-400',
  },
  'em-andamento': {
    label: 'Em andamento',
    classes: 'text-amber-600 bg-amber-50 border border-amber-200 dark:bg-amber-900/40 dark:border-amber-700',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    border: 'border-amber-400',
  },
  'em-revisao': {
    label: 'Revisar',
    classes: 'text-violet-600 bg-violet-50 border border-violet-200 dark:bg-violet-900/40 dark:border-violet-700',
    text: 'text-violet-600',
    dot: 'bg-violet-500',
    border: 'border-violet-400',
  },
  'validar': {
    label: 'Validar',
    classes: 'text-cyan-600 bg-cyan-50 border border-cyan-200 dark:bg-cyan-900/40 dark:border-cyan-700',
    text: 'text-cyan-600',
    dot: 'bg-cyan-500',
    border: 'border-cyan-400',
  },
  'bloqueado': {
    label: 'Bloqueado',
    classes: 'text-red-600 bg-red-50 border border-red-200 dark:bg-red-900/40 dark:border-red-700',
    text: 'text-red-600',
    dot: 'bg-red-500',
    border: 'border-red-400',
  },
  'atrasado': {
    label: 'Atrasado',
    classes: 'text-rose-600 bg-rose-50 border border-rose-200 dark:bg-rose-900/40 dark:border-rose-700',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
    border: 'border-rose-400',
  },
  'concluido': {
    label: 'Concluído',
    classes: 'text-emerald-600 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-700',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    border: 'border-emerald-400',
  },
  'pausado': {
    label: 'Pausado',
    classes: 'text-slate-500 bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-600',
    text: 'text-slate-500',
    dot: 'bg-slate-400',
    border: 'border-slate-400',
  },
  'cancelado': {
    label: 'Cancelado',
    classes: 'text-gray-500 bg-gray-50 border border-gray-200 dark:bg-gray-800/60 dark:border-gray-600',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
    border: 'border-gray-400',
  },
}

export function usePriorityMeta(key: PriorityKey): BadgeMeta {
  return PRIORITY_META[key]
}

export function useStatusMeta(key: StatusKey): BadgeMeta {
  return STATUS_META[key]
}

export function useStatusList(): StatusKey[] {
  return ['a-fazer', 'em-andamento', 'em-revisao', 'validar', 'concluido']
}

export function usePriorityList(): PriorityKey[] {
  return ['critica', 'alta', 'media', 'baixa']
}

/** Opções de prioridade prontas para selects ({ label, value }). */
export function usePriorityOptions(keys: PriorityKey[] = usePriorityList()) {
  return keys.map((value) => ({ value, label: PRIORITY_META[value].label }))
}

/** Opções de status prontas para selects ({ label, value }). */
export function useStatusOptions(keys: StatusKey[] = useStatusList()) {
  return keys.map((value) => ({ value, label: STATUS_META[value].label }))
}
