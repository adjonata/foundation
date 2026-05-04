import { permissionService } from '../../../services/permission.service'
import { toHttpError } from '../../../utils/errors'
import { PERMISSIONS } from '../../../utils/permissions'
import { requirePermission } from '../../../utils/requirePermission'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_PERMISSIONS_READ)
    const permissions = await permissionService.listPermissions()
    return ok(permissions)
  } catch (error) {
    throw toHttpError(error)
  }
})
