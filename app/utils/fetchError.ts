export function getFetchErrorMessage(error: unknown): string {
  const e = error as {
    data?: { message?: string; statusMessage?: string }
    statusMessage?: string
    message?: string
  }
  return e.data?.message ?? e.data?.statusMessage ?? e.statusMessage ?? e.message ?? 'Erro na requisicao'
}
