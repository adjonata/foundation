/** Resposta de GET /api/admin/permissions */
export type AdminPermission = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

/** Item de GET /api/admin/roles */
export type AdminRoleWithPermissions = {
  role: string
  permissions: { name: string, description: string | null }[]
}
