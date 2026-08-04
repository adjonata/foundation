export function getFetchErrorMessage(error: unknown): string {
  const e = error as {
    data?: { message?: string; statusMessage?: string; retryAfter?: number }
    statusMessage?: string
    message?: string
  }

  if (typeof e.data?.retryAfter === 'number') {
    return getRateLimitMessage(e.data.retryAfter)
  }

  return e.data?.message ?? e.data?.statusMessage ?? e.statusMessage ?? e.message ?? 'Erro na requisicao'
}

/** Mensagem amigavel para 429, com o tempo de espera calculado a partir do header `Retry-After`. */
function getRateLimitMessage(retryAfterSeconds: number): string {
  if (retryAfterSeconds <= 0) {
    return 'Muitas tentativas. Tente novamente mais tarde.'
  }
  if (retryAfterSeconds < 60) {
    return `Muitas tentativas. Tente novamente em ${retryAfterSeconds} segundo${retryAfterSeconds === 1 ? '' : 's'}.`
  }
  const minutes = Math.ceil(retryAfterSeconds / 60)
  return `Muitas tentativas. Tente novamente em ${minutes} minuto${minutes === 1 ? '' : 's'}.`
}
