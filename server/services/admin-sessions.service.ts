import type { AdminSessionListItem, AdminSessionsListResponse } from '#shared/types/admin'
import type { AdminSessionsQuery } from '#shared/schemas/admin-sessions.query'
import { buildPaginatedResult, computeSkip } from '#shared/utils/pagination'
import { authSessionRepository, type AdminActiveSessionRow } from '../repositories/auth-session.repository'
import { AppError } from '../utils/errors'

function toListItem(row: AdminActiveSessionRow): AdminSessionListItem {
  return {
    id: row.id,
    userId: row.userId,
    expiresAt: row.expiresAt.toISOString(),
    revokedAt: row.revokedAt ? row.revokedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    user: {
      id: row.user.id,
      email: row.user.email,
      name: row.user.name,
      role: row.user.role,
    },
  }
}

export const adminSessionsService = {
  async listActivePaginated(query: AdminSessionsQuery): Promise<AdminSessionsListResponse> {
    const skip = computeSkip(query.page, query.pageSize)
    const { total, rows } = await authSessionRepository.listActivePaginatedForAdmin({
      skip,
      take: query.pageSize,
    })
    const items = rows.map(toListItem)
    return buildPaginatedResult(items, total, query.page, query.pageSize)
  },

  async revokeSession({ sessionId }: { sessionId: number }): Promise<void> {
    const result = await authSessionRepository.revokeById(sessionId)
    if (result === 'NOT_FOUND') {
      throw new AppError('SESSION_NOT_FOUND', 'Sessao nao encontrada', 404)
    }
  },
}
