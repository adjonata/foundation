import type { AdminUserListItem, AdminUsersListResponse } from '#shared/types/admin'
import type { AdminUsersQuery } from '#shared/schemas/admin-users.query'
import { buildPaginatedResult, computeSkip } from '#shared/utils/pagination'
import type { AdminListedUserRow } from '../repositories/user.repository'
import { userRepository } from '../repositories/user.repository'

function toListItem(row: AdminListedUserRow): AdminUserListItem {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const adminUsersService = {
  async listPaginated(query: AdminUsersQuery): Promise<AdminUsersListResponse> {
    const skip = computeSkip(query.page, query.pageSize)
    const { total, rows } = await userRepository.listPaginatedForAdmin({
      search: query.search,
      skip,
      take: query.pageSize,
    })
    const items = rows.map(toListItem)
    return buildPaginatedResult(items, total, query.page, query.pageSize)
  },
}
