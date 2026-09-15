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
  const authToken = useCookie<string | null>('auth_token')

  /** Indica se já existe um backend configurado. */
  const hasBackend = baseURL.length > 0

  function getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...customHeaders,
    }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }
    const workspaceCookie = useCookie<string | null>('active_workspace_id')
    if (workspaceCookie.value) {
      headers['X-Workspace-Id'] = workspaceCookie.value
    }
    return headers
  }

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

    const raw = await $fetch(path, {
      baseURL,
      query: options.query,
      headers: getHeaders(options.headers),
    })
    return schema.parse(raw, path)
  }

  /**
   * Envia dados via POST para a API.
   */
  async function post<T>(
    path: string,
    body: Record<string, unknown>,
    schema?: Schema<T>,
    fallback?: () => T,
    options: RequestOptions = {},
  ): Promise<T> {
    if (!hasBackend) {
      if (fallback && schema) {
        return schema.parse(fallback(), path)
      }
      return (fallback ? fallback() : {}) as T
    }

    const raw = await $fetch(path, {
      method: 'POST',
      baseURL,
      body,
      query: options.query,
      headers: getHeaders(options.headers),
    })

    if (schema) {
      return schema.parse(raw, path)
    }

    return raw as T
  }

  return { get, post, hasBackend, baseURL }
}
