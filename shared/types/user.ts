/**
 * Usuario exposto na API (sem credenciais). Fonte unica do contrato com o cliente.
 * Use no servidor em `sanitizeUser` / servicos e no app em stores e componentes.
 */
export type AuthUser = {
  id: number
  email: string
  name: string | null
  role: string
}
