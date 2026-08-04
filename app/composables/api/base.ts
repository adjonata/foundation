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
  let refreshFailureHandled = false

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

  // O $fetch (ofetch) expõe em `error.data` o corpo inteiro da resposta de erro do Nitro
  // (`{ statusCode, statusMessage, message, data, stack }`), nao so o `data` customizado que
  // as rotas passam pra `createError`/`toHttpError`. Sem isso, `error.data?.code` do chamador
  // fica sempre undefined.
  function unwrapErrorData(error: unknown): unknown {
    const data = (error as ApiLikeError).data
    if (data && typeof data === 'object' && 'statusCode' in data) {
      return (data as { data?: unknown }).data
    }
    return data
  }

  function throwNormalized(error: unknown): never {
    throw createError({
      statusCode: getStatusCode(error),
      statusMessage: getFetchErrorMessage(error),
      data: unwrapErrorData(error),
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

  async function handleRefreshFailure() {
    if (!import.meta.client || refreshFailureHandled) return
    refreshFailureHandled = true

    const authStore = useAuthStore()
    authStore.clearSession()
    authStore.sessionChecked = true

    const nuxtApp = useNuxtApp()
    nuxtApp.$toast.add({
      title: 'Sessão expirada',
      description: 'Faça login novamente para continuar.',
      color: 'warning',
    })

    const route = useRoute()
    const redirect =
      typeof route.fullPath === 'string' && route.fullPath.startsWith('/') && !route.fullPath.startsWith('//')
        ? route.fullPath
        : '/'

    await navigateTo({
      path: '/entrar',
      query: { redirect },
    })
  }

  // Normaliza erros e tenta refresh automatico em respostas 401.
  // No SSR o refresh nao e tentado: os novos cookies seriam gravados apenas no
  // sub-request interno do Nitro e nunca chegariam ao browser. O cliente faz o
  // refresh corretamente apos a hidratacao.
  async function execute<T>(request: () => Promise<T>, options?: ExecuteOptions): Promise<T> {
    const retryOn401 = options?.retryOn401 ?? true

    try {
      return await request()
    } catch (error) {
      if (retryOn401 && getStatusCode(error) === 401 && import.meta.client) {
        try {
          await refreshSession()
          return await request()
        } catch (retryError) {
          await handleRefreshFailure()
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
