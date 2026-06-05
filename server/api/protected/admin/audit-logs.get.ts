import { getQuery } from 'h3'
import { adminAuditLogsQuerySchema } from '#shared/schemas/admin-audit-logs.query'
import { adminAuditLogsService } from '../../../services/admin-audit-logs.service'
import { toHttpError } from '../../../utils/errors'
import { PERMISSIONS } from '../../../utils/permissions'
import { requirePermission } from '../../../utils/requirePermission'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    requirePermission(event, PERMISSIONS.ADMIN_AUDIT_LOGS_READ)
    const query = adminAuditLogsQuerySchema.parse(getQuery(event))
    const result = await adminAuditLogsService.listPaginated(query)
    return ok(result)
  } catch (error) {
    throw toHttpError(error)
  }
})
