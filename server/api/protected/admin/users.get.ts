import { getQuery } from 'h3'
import { adminUsersQuerySchema } from '#shared/schemas/admin-users.query'
import { adminUsersService } from '../../../services/admin-users.service'
import { toHttpError } from '../../../utils/errors'
import { PERMISSIONS } from '../../../utils/permissions'
import { requirePermission } from '../../../utils/requirePermission'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_USERS_READ)
    const query = adminUsersQuerySchema.parse(getQuery(event))
    const result = await adminUsersService.listPaginated(query)
    return ok(result)
  } catch (error) {
    throw toHttpError(error)
  }
})
