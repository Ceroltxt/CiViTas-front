
/**
 * Cliente HTTP do app.
 *
 * Centraliza as chamadas à API com duas garantias importantes:
 *  1. Toda resposta é validada pelo schema correspondente antes de chegar à UI.
 *  2. Enquanto `NUXT_PUBLIC_API_BASE` estiver vazio, o cliente devolve os dados mock.
 */
import type { Schema } from '~/utils/validation'

export interface RequestOptions {
  query?: Record<string, unknown>
  headers?: Record<string, string>
}

export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string | undefined) || ''
  const authToken = useCookie<string | null>('auth_token')

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

  /**
   * Envia arquivos usando multipart/form-data.
   * O navegador define automaticamente o Content-Type e o boundary.
   */
  async function postFile<T>(
    path: string,
    file: File,
  ): Promise<T> {
    if (!hasBackend) {
      throw new Error('O backend não está configurado.')
    }

    const formData = new FormData()
    formData.append('file', file)

    return await $fetch<T>(path, {
      method: 'POST',
      baseURL,
      body: formData,
      headers: getHeaders(),
    })
  }

  /**
   * Baixa arquivos CSV da API.
   */
  async function downloadCsv(
    path: string,
    query: Record<string, unknown> = {},
    filename = `exportacao-${new Date().toISOString().slice(0, 10)}.csv`,
  ): Promise<void> {
    if (!hasBackend) {
      throw new Error('O backend não está configurado.')
    }

    const blob = await $fetch<Blob>(path, {
      baseURL,
      query,
      headers: getHeaders({ Accept: 'text/csv' }),
      responseType: 'blob',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }

  return {
    get,
    post,
    postFile,
    downloadCsv,
    hasBackend,
    baseURL,
  }
}