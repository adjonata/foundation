/** Papéis que podem aceder ao painel admin (`/api/protected/admin/*` exige SUPER_ADMIN no servidor). */
export const ADMIN_PANEL_ROLES = ['SUPER_ADMIN'] as const

export type AdminPanelRole = (typeof ADMIN_PANEL_ROLES)[number]

export function isAdminPanelRole(role: string | null | undefined): role is AdminPanelRole {
  return role === 'SUPER_ADMIN'
}
