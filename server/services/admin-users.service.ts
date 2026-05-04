import type { AdminUserListItem, AdminUsersListResponse } from '#shared/types/admin'
import type { AdminUsersQuery } from '#shared/schemas/admin-users.query'
import { buildPaginatedResult, computeSkip } from '#shared/utils/pagination'
import { Role } from '../../prisma/generated/client'
import { AppError } from '../utils/errors'
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

  async updateUserRole(targetUserId: number, newRole: Role): Promise<AdminUserListItem> {
    const result = await userRepository.assignRoleById(targetUserId, newRole)
    if (!result.success) {
      if (result.code === 'NOT_FOUND') {
        throw new AppError('USER_NOT_FOUND', 'Utilizador nao encontrado', 404)
      }
      throw new AppError('LAST_SUPER_ADMIN', 'Nao e possivel alterar o papel do ultimo SUPER_ADMIN do sistema', 409)
    }
    return toListItem(result.row)
  },
}
