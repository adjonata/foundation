/** Rótulos amigáveis dos valores do enum `Role` (Prisma). */
const ROLE_DISPLAY_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super administrador',
  ADMIN: 'Administrador',
  USER: 'Utilizador',
}

/** Cor do `UBadge` por papel (Nuxt UI). */
export type RoleBadgeColor = 'error' | 'primary' | 'neutral'

/**
 * Texto curto para UI (cabeçalho, badges, tabelas).
 * Valores desconhecidos devolvem o próprio identificador.
 */
export function getRoleDisplayLabel(role: string | null | undefined): string {
  if (!role) return ''
  return ROLE_DISPLAY_LABELS[role] ?? role
}

/** Cor visual do badge por nível de privilégio. */
export function getRoleBadgeColor(role: string | null | undefined): RoleBadgeColor {
  if (role === 'SUPER_ADMIN') return 'error'
  if (role === 'ADMIN') return 'primary'
  return 'neutral'
}
