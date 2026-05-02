import { getFetchErrorMessage } from '~/utils/fetchError'

type ApiOptions = NonNullable<Parameters<typeof $fetch>[1]>

type ApiOptionsWithDefaults = ApiOptions & {
  credentials: 'include'
}

type ExecuteOptions = {
  retryOn401?: boolean
}

export function useApiBase() {
  let refreshInFlight: Promise<void> | null = null

  // No SSR, reenviamos o cookie da request original para manter a sessao.
  const forwardedCookies = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  function resolveHeaders(extra?: HeadersInit): HeadersInit | undefined {
    const onServer = import.meta.server
    const forwardCookie = onServer && Boolean(forwardedCookies?.cookie)

    if (!forwardCookie) return extra

    return {
      ...forwardedCookies,
      ...(extra && typeof extra === 'object' && !Array.isArray(extra) ? (extra as Record<string, string>) : {}),
    }
  }

  // Defaults compartilhados para todas as chamadas da API sem perder inferencia do Nitro.
  function withDefaults(): ApiOptionsWithDefaults
  function withDefaults<T extends ApiOptions>(options: T): T & ApiOptionsWithDefaults
  function withDefaults(options?: ApiOptions) {
    const safeOptions = options ?? ({} as ApiOptions)
    const headers = resolveHeaders(safeOptions.headers)

    return {
      ...safeOptions,
      credentials: 'include',
      ...(headers ? { headers } : {}),
    }
  }

  function getStatusCode(error: unknown): number {
    const apiError = error as ApiLikeError
    return apiError.statusCode ?? apiError.status ?? 500
  }

  function throwNormalized(error: unknown): never {
    const apiError = error as ApiLikeError

    throw createError({
      statusCode: getStatusCode(error),
      statusMessage: getFetchErrorMessage(error),
      data: apiError.data,
    })
  }

  // Revalida sessao apenas uma vez por vez para evitar chamadas concorrentes em cascata.
  async function refreshSession() {
    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        await $fetch('/api/auth/refresh', withDefaults({ method: 'post' }))
      })()
    }

    try {
      await refreshInFlight
    } finally {
      refreshInFlight = null
    }
  }

  // Normaliza erros e tenta refresh automatico em respostas 401.
  async function execute<T>(request: () => Promise<T>, options?: ExecuteOptions): Promise<T> {
    const retryOn401 = options?.retryOn401 ?? true

    try {
      return await request()
    } catch (error) {
      if (retryOn401 && getStatusCode(error) === 401) {
        try {
          await refreshSession()
          return await request()
        } catch (retryError) {
          throwNormalized(retryError)
        }
      }

      throwNormalized(error)
    }
  }

  return {
    withDefaults,
    execute,
  }
}
