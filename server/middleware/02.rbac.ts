import { createError } from 'h3'
import { hasPermission } from '../utils/hasPermission'
import { PERMISSIONS, type PermissionName } from '../utils/permissions'

const ADMIN_API_PREFIX = '/api/admin'

const ROUTE_PERMISSIONS: Record<string, PermissionName> = {
  'GET /api/admin/permissions': PERMISSIONS.ADMIN_PERMISSIONS_READ,
  'GET /api/admin/roles': PERMISSIONS.ADMIN_ROLES_READ,
}

export default defineEventHandler((event) => {
  if (!event.path.startsWith(ADMIN_API_PREFIX)) return

  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }

  const routeKey = `${event.method.toUpperCase()} ${event.path}`
  const requiredPermission = ROUTE_PERMISSIONS[routeKey]
  if (!requiredPermission) return

  if (!hasPermission(event.context.auth.role, requiredPermission)) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissao para acessar este recurso' })
  }
})
