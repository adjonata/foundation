import { createError, type H3Event } from 'h3'
import { hasPermission } from './hasPermission'
import type { PermissionName } from './permissions'

/** Contexto de sessão após verificação (alinhado a `event.context.auth`). */
export type SessionAuth = NonNullable<H3Event['context']['auth']>

/**
 * Exige cookie de acesso válido (via middleware de auth) e papel com a permissão indicada.
 * Usar no início de handlers em `server/api/protected/admin/**`.
 */
export function requirePermission(event: H3Event, permission: PermissionName): SessionAuth {
  const auth = event.context.auth
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }
  if (!hasPermission(auth.role, permission)) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissao para acessar este recurso' })
  }
  return auth
}
