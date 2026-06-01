/**
 * Cliente HTTP do app.
 *
 * Centraliza as chamadas à API com duas garantias importantes:
 *  1. Toda resposta é validada pelo schema correspondente antes de chegar à UI.
 *  2. Enquanto `NUXT_PUBLIC_API_BASE` estiver vazio (sem backend ainda), o
 *     cliente devolve os dados mock — também validados pelo mesmo schema.
 *
 * Resultado: o dia em que o backend existir, basta definir a variável de
 * ambiente; nenhuma tela precisa mudar.
 */
import type { Schema } from '~/utils/validation'

export interface RequestOptions {
  /** Query string opcional (ex.: filtros, paginação). */
  query?: Record<string, unknown>
}

export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string | undefined) || ''

  /** Indica se já existe um backend configurado. */
  const hasBackend = baseURL.length > 0

  /**
   * Busca um recurso e valida com `schema`. Sem backend configurado, resolve
   * com `fallback()` (mock) — mantendo o mesmo contrato.
   */
  async function get<T>(
    path: string,
    schema: Schema<T>,
    fallback: () => T,
    options: RequestOptions = {},
  ): Promise<T> {
    if (!hasBackend) {
      return schema.parse(fallback(), path)
    }

    const raw = await $fetch(path, { baseURL, query: options.query })
    return schema.parse(raw, path)
  }

  return { get, hasBackend, baseURL }
}
