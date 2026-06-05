import type { AdminUserListItem, AdminUsersListResponse } from '#shared/types/admin'
import type { AdminUsersQuery } from '#shared/schemas/admin-users.query'
import { buildPaginatedResult, computeSkip } from '#shared/utils/pagination'
import { Role } from '../../prisma/generated/client'
import { AppError } from '../utils/errors'
import type { AdminListedUserRow } from '../repositories/user.repository'
import { userRepository } from '../repositories/user.repository'
import { authRepository } from '../repositories/auth.repository'
import { authService } from './auth.service'
import { audit } from '../utils/audit'

function toListItem(row: AdminListedUserRow): AdminUserListItem {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    emailVerified: row.emailVerifiedAt !== null,
    deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
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
      showDeleted: query.showDeleted,
    })
    const items = rows.map(toListItem)
    return buildPaginatedResult(items, total, query.page, query.pageSize)
  },

  async updateUserRole({
    targetUserId,
    newRole,
    actorId,
  }: {
    targetUserId: number
    newRole: Role
    actorId: number
  }): Promise<AdminUserListItem> {
    const result = await userRepository.assignRoleById(targetUserId, newRole)
    if (!result.success) {
      if (result.code === 'NOT_FOUND') {
        throw new AppError('USER_NOT_FOUND', 'Utilizador nao encontrado', 404)
      }
      throw new AppError('LAST_SUPER_ADMIN', 'Nao e possivel alterar o papel do ultimo SUPER_ADMIN do sistema', 409)
    }
    await authRepository.revokeAllUserSessions(targetUserId)
    await audit({
      event: 'USER_ROLE_CHANGED',
      actorId,
      entityId: String(targetUserId),
      metadata: { from: result.previousRole, to: newRole },
    })
    return toListItem(result.row)
  },

  async resendVerification({ targetUserId, actorId }: { targetUserId: number; actorId: number }) {
    await authService.resendVerification({ userId: targetUserId })
    await audit({ event: 'VERIFICATION_RESENT', actorId, entityId: String(targetUserId) })
  },

  async restoreUser({ targetUserId, actorId }: { targetUserId: number; actorId: number }): Promise<AdminUserListItem> {
    const result = await userRepository.restoreById(targetUserId)
    if (!result.success) {
      if (result.code === 'NOT_FOUND') throw new AppError('USER_NOT_FOUND', 'Utilizador nao encontrado', 404)
      throw new AppError('ALREADY_ACTIVE', 'Utilizador ja esta ativo', 409)
    }
    await audit({ event: 'USER_RESTORED', actorId, entityId: String(targetUserId) })
    return toListItem(result.row)
  },

  async deleteUser({ targetUserId, actorId }: { targetUserId: number; actorId: number }): Promise<AdminUserListItem> {
    const result = await userRepository.softDeleteById(targetUserId)
    if (!result.success) {
      if (result.code === 'NOT_FOUND') throw new AppError('USER_NOT_FOUND', 'Utilizador nao encontrado', 404)
      if (result.code === 'ALREADY_DELETED') throw new AppError('ALREADY_DELETED', 'Utilizador ja desativado', 409)
      throw new AppError('LAST_SUPER_ADMIN', 'Nao e possivel desativar o ultimo SUPER_ADMIN do sistema', 409)
    }
    await audit({ event: 'USER_DELETED', actorId, entityId: String(targetUserId) })
    return toListItem(result.row)
  },
}
