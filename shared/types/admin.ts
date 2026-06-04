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
  permissions: { name: string; description: string | null }[]
}

/** Utilizador listado no painel admin (sem credenciais). Resposta de `PATCH .../users/:id/role`. */
export type AdminUserListItem = {
  id: number
  email: string
  name: string | null
  role: string
  emailVerified: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

/** Resposta de GET /api/protected/admin/users */
export type AdminUsersListResponse = PaginatedResult<AdminUserListItem>

/** Sessao ativa listada no painel admin (sem tokens). */
export type AdminSessionListItem = {
  id: number
  userId: number
  expiresAt: string
  revokedAt: string | null
  createdAt: string
  user: {
    id: number
    email: string
    name: string | null
    role: string
  }
}

/** Resposta de GET /api/protected/admin/sessions */
export type AdminSessionsListResponse = PaginatedResult<AdminSessionListItem>
