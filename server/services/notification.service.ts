import { notificationRepository } from '../repositories/notification.repository'
import { AppError } from '../utils/errors'
import { buildPaginatedResult, computeSkip } from '#shared/utils/pagination'

export const notificationService = {
  async listUnread({ userId, page, pageSize }: { userId: number; page: number; pageSize: number }) {
    const skip = computeSkip(page, pageSize)
    const { total, rows } = await notificationRepository.listUnreadForUser({ userId, skip, take: pageSize })
    return buildPaginatedResult(rows, total, page, pageSize)
  },

  async listAll({ userId, page, pageSize }: { userId: number; page: number; pageSize: number }) {
    const skip = computeSkip(page, pageSize)
    const { total, rows } = await notificationRepository.listAllForUser({ userId, skip, take: pageSize })
    return buildPaginatedResult(rows, total, page, pageSize)
  },

  async markAsRead({ id, userId }: { id: number; userId: number }) {
    const notification = await notificationRepository.findByIdForUser({ id, userId })
    if (!notification) throw new AppError('NOT_FOUND', 'Notificação não encontrada', 404)
    await notificationRepository.markAsRead({ id, userId })
  },

  async markAllAsRead({ userId }: { userId: number }) {
    await notificationRepository.markAllAsRead({ userId })
  },
}
