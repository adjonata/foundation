import { permissionService } from '../../../services/permission.service'
import { toHttpError } from '../../../utils/errors'
import { PERMISSIONS } from '../../../utils/permissions'
import { requirePermission } from '../../../utils/requirePermission'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_ROLES_READ)
    const roles = await permissionService.listRolesWithPermissions()
    return ok(roles)
  } catch (error) {
    throw toHttpError(error)
  }
})
