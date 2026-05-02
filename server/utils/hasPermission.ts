import { Role } from '../../prisma/generated/client'
import { ROLE_PERMISSIONS, type PermissionName } from './permissions'

export function hasPermission(role: string, permission: PermissionName): boolean {
  if (!Object.values(Role).includes(role as Role)) return false
  return ROLE_PERMISSIONS[role as Role].includes(permission)
}
