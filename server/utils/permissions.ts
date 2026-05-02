import { Role } from '../../prisma/generated/client'

export const PERMISSIONS = {
  ADMIN_PERMISSIONS_READ: 'admin.permissions.read',
  ADMIN_ROLES_READ: 'admin.roles.read',
  ADMIN_USERS_READ: 'admin.users.read',
  ADMIN_USERS_ROLE_UPDATE: 'admin.users.role.update',
  ADMIN_SESSIONS_READ: 'admin.sessions.read',
  ADMIN_SESSIONS_REVOKE: 'admin.sessions.revoke',
} as const

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

type PermissionDefinition = {
  name: PermissionName
  description: string
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  { name: PERMISSIONS.ADMIN_PERMISSIONS_READ, description: 'Permite listar permissões do painel admin' },
  { name: PERMISSIONS.ADMIN_ROLES_READ, description: 'Permite listar papéis e permissões do painel admin' },
  { name: PERMISSIONS.ADMIN_USERS_READ, description: 'Permite listar utilizadores no painel admin' },
  { name: PERMISSIONS.ADMIN_USERS_ROLE_UPDATE, description: 'Permite alterar papel de utilizador no painel admin' },
  { name: PERMISSIONS.ADMIN_SESSIONS_READ, description: 'Permite listar sessões ativas no painel admin' },
  { name: PERMISSIONS.ADMIN_SESSIONS_REVOKE, description: 'Permite revogar sessões no painel admin' },
]

export const ROLE_PERMISSIONS: Record<Role, PermissionName[]> = {
  [Role.SUPER_ADMIN]: PERMISSION_DEFINITIONS.map((permission) => permission.name),
  [Role.ADMIN]: [PERMISSIONS.ADMIN_PERMISSIONS_READ, PERMISSIONS.ADMIN_ROLES_READ],
  [Role.USER]: [],
}
