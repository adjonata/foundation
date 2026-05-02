import { permissionService } from '../../services/permission.service'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async () => {
  try {
    const roles = await permissionService.listRolesWithPermissions()
    return ok(roles)
  } catch (error) {
    throw toHttpError(error)
  }
})
