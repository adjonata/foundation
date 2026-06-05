import { getRouterParam } from 'h3'
import { z } from 'zod'
import { adminUsersService } from '../../../../services/admin-users.service'
import { toHttpError } from '../../../../utils/errors'
import { PERMISSIONS } from '../../../../utils/permissions'
import { requirePermission } from '../../../../utils/requirePermission'
import { ok } from '../../../../utils/response'

const idParamSchema = z.coerce.number().int().positive()

export default defineEventHandler(async (event) => {
  try {
    const auth = requirePermission(event, PERMISSIONS.ADMIN_USERS_DELETE)
    const id = idParamSchema.parse(getRouterParam(event, 'id'))
    const user = await adminUsersService.deleteUser({ targetUserId: id, actorId: auth.userId })
    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
