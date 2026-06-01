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
  'planejado': {
    label: 'Planejado',
    classes: 'text-blue-600 bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    border: 'border-blue-400',
  },
  'em-andamento': {
    label: 'Em Andamento',
    classes: 'text-amber-600 bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    border: 'border-amber-400',
  },
  'em-revisao': {
    label: 'Em Revisão',
    classes: 'text-violet-600 bg-violet-50',
    text: 'text-violet-600',
    dot: 'bg-violet-500',
    border: 'border-violet-400',
  },
  'bloqueado': {
    label: 'Bloqueado',
    classes: 'text-red-600 bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    border: 'border-red-400',
  },
  'atrasado': {
    label: 'Atrasado',
    classes: 'text-rose-600 bg-rose-50',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
    border: 'border-rose-400',
  },
  'concluido': {
    label: 'Concluído',
    classes: 'text-emerald-600 bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    border: 'border-emerald-400',
  },
}

export function usePriorityMeta(key: PriorityKey): BadgeMeta {
  return PRIORITY_META[key]
}

export function useStatusMeta(key: StatusKey): BadgeMeta {
  return STATUS_META[key]
}

export function useStatusList(): StatusKey[] {
  return ['planejado', 'em-andamento', 'em-revisao', 'bloqueado', 'concluido']
}

export function usePriorityList(): PriorityKey[] {
  return ['critica', 'alta', 'media', 'baixa']
}

/** Opções de prioridade prontas para selects ({ label, value }). */
export function usePriorityOptions(keys: PriorityKey[] = usePriorityList()) {
  return keys.map((value) => ({ value, label: PRIORITY_META[value].label }))
}
