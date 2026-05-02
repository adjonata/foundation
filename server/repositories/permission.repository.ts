import { Role } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

export const permissionRepository = {
  listAll() {
    return prisma.permission.findMany({
      orderBy: { name: 'asc' },
    })
  },

  listByRole(role: Role) {
    return prisma.permission.findMany({
      where: {
        rolePermissions: {
          some: { role },
        },
      },
      orderBy: { name: 'asc' },
    })
  },

  listRolesWithPermissions() {
    return prisma.rolePermission.groupBy({
      by: ['role'],
      orderBy: { role: 'asc' },
    })
  },

  listRolePermissions() {
    return prisma.rolePermission.findMany({
      include: { permission: true },
      orderBy: [{ role: 'asc' }, { permission: { name: 'asc' } }],
    })
  },
}
