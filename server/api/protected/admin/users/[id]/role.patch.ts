import { readBody, getRouterParam } from 'h3'
import { adminUserIdParamSchema, adminUserRoleUpdateBodySchema } from '#shared/schemas/admin-user-role.patch'
import { adminUsersService } from '../../../../../services/admin-users.service'
import { toHttpError } from '../../../../../utils/errors'
import { PERMISSIONS } from '../../../../../utils/permissions'
import { requirePermission } from '../../../../../utils/requirePermission'
import { ok } from '../../../../../utils/response'
import { Role } from '../../../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_USERS_ROLE_UPDATE)
    const id = adminUserIdParamSchema.parse(getRouterParam(event, 'id'))
    const body = adminUserRoleUpdateBodySchema.parse(await readBody(event))
    const newRole = body.role as Role
    const user = await adminUsersService.updateUserRole(id, newRole)
    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
