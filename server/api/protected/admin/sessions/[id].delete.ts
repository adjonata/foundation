import { getRouterParam, setResponseStatus } from 'h3'
import { adminSessionIdParamSchema } from '#shared/schemas/admin-session.params'
import { adminSessionsService } from '../../../../services/admin-sessions.service'
import { toHttpError } from '../../../../utils/errors'
import { PERMISSIONS } from '../../../../utils/permissions'
import { requirePermission } from '../../../../utils/requirePermission'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_SESSIONS_REVOKE)
    const id = adminSessionIdParamSchema.parse(getRouterParam(event, 'id'))
    await adminSessionsService.revokeSession({ sessionId: id })
    setResponseStatus(event, 204)
  } catch (error) {
    throw toHttpError(error)
  }
})
