import type { AdminAuditLogItem, AdminAuditLogsListResponse } from '#shared/types/admin'
import type { AdminAuditLogsQuery } from '#shared/schemas/admin-audit-logs.query'
import { buildPaginatedResult, computeSkip } from '#shared/utils/pagination'
import type { AuditLogRow } from '../repositories/audit-log.repository'
import { auditLogRepository } from '../repositories/audit-log.repository'

function toListItem(row: AuditLogRow): AdminAuditLogItem {
  return {
    id: row.id,
    actorId: row.actorId,
    action: row.action,
    entity: row.entity,
    entityId: row.entityId,
    metadata: row.metadata as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
    actor: row.actor ? { id: row.actor.id, email: row.actor.email, name: row.actor.name } : null,
  }
}

export const adminAuditLogsService = {
  async listPaginated(query: AdminAuditLogsQuery): Promise<AdminAuditLogsListResponse> {
    const skip = computeSkip(query.page, query.pageSize)
    const { total, rows } = await auditLogRepository.listPaginated({
      filters: {
        actorId: query.actorId,
        action: query.action,
        entity: query.entity,
        from: query.from ? new Date(query.from) : undefined,
        to: query.to ? new Date(query.to) : undefined,
      },
      skip,
      take: query.pageSize,
    })
    return buildPaginatedResult(rows.map(toListItem), total, query.page, query.pageSize)
  },
}
