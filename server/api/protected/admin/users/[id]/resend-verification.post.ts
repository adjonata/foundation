import { getRouterParam } from 'h3'
import { adminUserIdParamSchema } from '#shared/schemas/admin-user-role.patch'
import { adminUsersService } from '../../../../../services/admin-users.service'
import { toHttpError } from '../../../../../utils/errors'
import { PERMISSIONS } from '../../../../../utils/permissions'
import { requirePermission } from '../../../../../utils/requirePermission'
import { ok } from '../../../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_USERS_RESEND_VERIFICATION)
    const id = adminUserIdParamSchema.parse(getRouterParam(event, 'id'))
    await adminUsersService.resendVerification({ targetUserId: id })
    return ok({ sent: true })
  } catch (error) {
    throw toHttpError(error)
  }
})
