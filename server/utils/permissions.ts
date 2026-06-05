import { Role } from '../../prisma/generated/client'

export const PERMISSIONS = {
  ADMIN_PERMISSIONS_READ: 'admin.permissions.read',
  ADMIN_ROLES_READ: 'admin.roles.read',
  ADMIN_USERS_READ: 'admin.users.read',
  ADMIN_USERS_ROLE_UPDATE: 'admin.users.role.update',
  ADMIN_USERS_RESEND_VERIFICATION: 'admin.users.resend-verification',
  ADMIN_USERS_DELETE: 'admin.users.delete',
  ADMIN_USERS_RESTORE: 'admin.users.restore',
  ADMIN_SESSIONS_READ: 'admin.sessions.read',
  ADMIN_SESSIONS_REVOKE: 'admin.sessions.revoke',
  ADMIN_AUDIT_LOGS_READ: 'admin.audit-logs.read',
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
  {
    name: PERMISSIONS.ADMIN_USERS_RESEND_VERIFICATION,
    description: 'Permite reenviar e-mail de verificacao para utilizadores no painel admin',
  },
  { name: PERMISSIONS.ADMIN_SESSIONS_READ, description: 'Permite listar sessões ativas no painel admin' },
  { name: PERMISSIONS.ADMIN_SESSIONS_REVOKE, description: 'Permite revogar sessões no painel admin' },
  { name: PERMISSIONS.ADMIN_USERS_DELETE, description: 'Permite desativar (soft delete) utilizadores no painel admin' },
  { name: PERMISSIONS.ADMIN_USERS_RESTORE, description: 'Permite reativar utilizadores desativados no painel admin' },
  { name: PERMISSIONS.ADMIN_AUDIT_LOGS_READ, description: 'Permite visualizar registos de auditoria no painel admin' },
]

export const ROLE_PERMISSIONS: Record<Role, PermissionName[]> = {
  [Role.SUPER_ADMIN]: PERMISSION_DEFINITIONS.map((permission) => permission.name),
  /** Rotas admin sao gated por middleware (apenas SUPER_ADMIN); mapa mantido explicitamente vazio. */
  [Role.ADMIN]: [],
  [Role.USER]: [],
}
