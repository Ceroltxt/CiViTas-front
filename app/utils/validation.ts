/**
 * Validação de dados em runtime — sem dependências externas.
 *
 * Objetivo: garantir que TUDO que chegar de um backend (HTTP/JSON) tenha o
 * formato esperado antes de ser usado pela UI. Se a API responder algo fora do
 * contrato, lançamos um `ValidationError` descritivo (com o caminho do campo)
 * em vez de deixar a tela quebrar silenciosamente.
 *
 * Para a pessoa de backend: cada `Schema` descreve exatamente o JSON que o
 * endpoint correspondente precisa devolver (veja `~/schemas`).
 *
 * Quando o time quiser adotar uma lib (ex.: Zod), basta reimplementar `v`
 * mantendo a mesma interface `Schema.parse` — o resto do app não muda.
 */

export type Schema<T> = {
  parse: (value: unknown, path?: string) => T
}

/** Extrai o tipo TypeScript validado por um schema. */
export type Infer<S> = S extends Schema<infer T> ? T : never

export class ValidationError extends Error {
  constructor(
    readonly path: string,
    readonly expected: string,
    readonly received: unknown,
  ) {
    super(`Dado inválido em "${path}": esperado ${expected}, recebido ${describe(received)}.`)
    this.name = 'ValidationError'
  }
}

function describe(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function fail(path: string, expected: string, received: unknown): never {
  throw new ValidationError(path, expected, received)
}

export const v = {
  string(): Schema<string> {
    return {
      parse(value, path = 'valor') {
        return typeof value === 'string' ? value : fail(path, 'texto (string)', value)
      },
    }
  },

  number(): Schema<number> {
    return {
      parse(value, path = 'valor') {
        return typeof value === 'number' && !Number.isNaN(value)
          ? value
          : fail(path, 'número', value)
      },
    }
  },

  boolean(): Schema<boolean> {
    return {
      parse(value, path = 'valor') {
        return typeof value === 'boolean' ? value : fail(path, 'booleano', value)
      },
    }
  },

  /** União de literais — ideal para status, prioridade, cores etc. */
  enum<const T extends readonly (string | number)[]>(...allowed: T): Schema<T[number]> {
    return {
      parse(value, path = 'valor') {
        return allowed.includes(value as T[number])
          ? (value as T[number])
          : fail(path, `um de [${allowed.join(', ')}]`, value)
      },
    }
  },

  /** Campo opcional/anulável (`undefined` ou ausente é aceito). */
  optional<T>(schema: Schema<T>): Schema<T | undefined> {
    return {
      parse(value, path = 'valor') {
        return value === undefined || value === null
          ? undefined
          : schema.parse(value, path)
      },
    }
  },

  array<T>(schema: Schema<T>): Schema<T[]> {
    return {
      parse(value, path = 'valor') {
        if (!Array.isArray(value)) return fail(path, 'lista (array)', value)
        return value.map((item, i) => schema.parse(item, `${path}[${i}]`))
      },
    }
  },

  object<S extends Record<string, Schema<unknown>>>(
    shape: S,
  ): Schema<{ [K in keyof S]: Infer<S[K]> }> {
    return {
      parse(value, path = 'valor') {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return fail(path, 'objeto', value)
        }
        const record = value as Record<string, unknown>
        const result = {} as { [K in keyof S]: Infer<S[K]> }
        for (const key in shape) {
          const childPath = path === 'valor' ? key : `${path}.${key}`
          result[key] = shape[key].parse(record[key], childPath) as Infer<S[typeof key]>
        }
        return result
      },
    }
  },
}
