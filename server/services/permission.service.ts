import { Role } from '../../prisma/generated/client'
import { permissionRepository } from '../repositories/permission.repository'

export const permissionService = {
  listPermissions() {
    return permissionRepository.listAll()
  },

  async listPermissionsByRole(role: Role) {
    return permissionRepository.listByRole(role)
  },

  async listRolesWithPermissions() {
    const rolePermissions = await permissionRepository.listRolePermissions()

    const grouped = new Map<Role, { role: Role; permissions: { name: string; description: string | null }[] }>()

    for (const entry of rolePermissions) {
      const current = grouped.get(entry.role)
      const permission = {
        name: entry.permission.name,
        description: entry.permission.description,
      }

      if (!current) {
        grouped.set(entry.role, { role: entry.role, permissions: [permission] })
        continue
      }

      current.permissions.push(permission)
    }

    return Object.values(Role).map((role) => grouped.get(role) ?? { role, permissions: [] })
  },
}
