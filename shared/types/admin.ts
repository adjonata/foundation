import type { PaginatedResult } from '#shared/types/pagination'

/** Resposta de GET /api/protected/admin/permissions */
export type AdminPermission = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

/** Item de GET /api/protected/admin/roles */
export type AdminRoleWithPermissions = {
  role: string
  permissions: { name: string, description: string | null }[]
}

/** Utilizador listado no painel admin (sem credenciais). */
export type AdminUserListItem = {
  id: number
  email: string
  name: string | null
  role: string
  createdAt: string
  updatedAt: string
}

/** Resposta de GET /api/protected/admin/users */
export type AdminUsersListResponse = PaginatedResult<AdminUserListItem>
