/** Papéis que podem aceder ao painel admin (alinhado a ROLE_PERMISSIONS no servidor). */
export const ADMIN_PANEL_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const

export type AdminPanelRole = (typeof ADMIN_PANEL_ROLES)[number]

export function isAdminPanelRole(role: string | null | undefined): role is AdminPanelRole {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}
