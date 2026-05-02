import { permissionService } from '../../services/permission.service'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async () => {
  try {
    const permissions = await permissionService.listPermissions()
    return ok(permissions)
  } catch (error) {
    throw toHttpError(error)
  }
})
