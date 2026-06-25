import type { Prisma } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

const notificationSelect = {
  id: true,
  userId: true,
  type: true,
  title: true,
  body: true,
  readAt: true,
  createdAt: true,
} satisfies Prisma.NotificationSelect

export type NotificationRow = Prisma.NotificationGetPayload<{ select: typeof notificationSelect }>

export const notificationRepository = {
  async create({ userId, type, title, body }: { userId: number; type: string; title: string; body: string }) {
    return prisma.notification.create({
      data: { userId, type, title, body },
      select: notificationSelect,
    })
  },

  async listUnreadForUser({ userId, skip, take }: { userId: number; skip: number; take: number }) {
    const where: Prisma.NotificationWhereInput = { userId, readAt: null }
    const [total, rows] = await prisma.$transaction([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: notificationSelect,
      }),
    ])
    return { total, rows }
  },

  async listAllForUser({ userId, skip, take }: { userId: number; skip: number; take: number }) {
    const where: Prisma.NotificationWhereInput = { userId }
    const [total, rows] = await prisma.$transaction([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: notificationSelect,
      }),
    ])
    return { total, rows }
  },

  async findByIdForUser({ id, userId }: { id: number; userId: number }) {
    return prisma.notification.findFirst({
      where: { id, userId },
      select: notificationSelect,
    })
  },

  async markAsRead({ id, userId }: { id: number; userId: number }) {
    return prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    })
  },

  async markAllAsRead({ userId }: { userId: number }) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    })
  },
}
