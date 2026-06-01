/** Abreviações de mês em português, fonte única para labels e ordenação. */
export const MONTHS_SHORT: string[] = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

/**
 * Chave de ordenação para datas no formato "DD Mês" (ex.: "12 Mai").
 * Itens sem data vão para o fim da lista.
 */
export function dueDateOrder(due?: string): number {
  if (!due) return Number.MAX_SAFE_INTEGER
  const [day, month] = due.split(' ')
  const m = MONTHS_SHORT.indexOf(month ?? '')
  return (m < 0 ? 12 : m) * 100 + Number(day ?? 0)
}

/** Rótulo "Mês Ano" (ex.: "Mai 2026") a partir do índice de mês (0–11). */
export function formatMonthLabel(year: number, month: number): string {
  return `${MONTHS_SHORT[month]} ${year}`
}
