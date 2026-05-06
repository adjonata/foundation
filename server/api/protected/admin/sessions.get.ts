import { getQuery } from 'h3'
import { adminSessionsQuerySchema } from '#shared/schemas/admin-sessions.query'
import { adminSessionsService } from '../../../services/admin-sessions.service'
import { toHttpError } from '../../../utils/errors'
import { PERMISSIONS } from '../../../utils/permissions'
import { requirePermission } from '../../../utils/requirePermission'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_SESSIONS_READ)
    const query = adminSessionsQuerySchema.parse(getQuery(event))
    const result = await adminSessionsService.listActivePaginated(query)
    return ok(result)
  } catch (error) {
    throw toHttpError(error)
  }
})
