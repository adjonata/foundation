import type { Prisma } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

const userSessionSelect = {
  id: true,
  createdAt: true,
  expiresAt: true,
} satisfies Prisma.AuthSessionSelect

export type UserSessionRow = Prisma.AuthSessionGetPayload<{ select: typeof userSessionSelect }>

const adminActiveSessionSelect = {
  id: true,
  userId: true,
  expiresAt: true,
  revokedAt: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  },
} satisfies Prisma.AuthSessionSelect

export type AdminActiveSessionRow = Prisma.AuthSessionGetPayload<{ select: typeof adminActiveSessionSelect }>

export const authSessionRepository = {
  /**
   * Sessoes ativas: nao revogadas e com refresh ainda valido (expiresAt > agora).
   */
  async listActivePaginatedForAdmin(params: { skip: number; take: number }) {
    const now = new Date()
    const where: Prisma.AuthSessionWhereInput = {
      revokedAt: null,
      expiresAt: { gt: now },
    }

    const [total, rows] = await prisma.$transaction([
      prisma.authSession.count({ where }),
      prisma.authSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
        select: adminActiveSessionSelect,
      }),
    ])

    return { total, rows }
  },

  listActiveForUser({ userId }: { userId: number }) {
    const now = new Date()
    return prisma.authSession.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
      select: userSessionSelect,
    })
  },

  async revokeByIdForUser({ sessionId, userId }: { sessionId: number; userId: number }) {
    const row = await prisma.authSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, revokedAt: true },
    })
    if (!row || row.userId !== userId) return 'NOT_FOUND' as const
    if (row.revokedAt) return 'ALREADY_REVOKED' as const
    await prisma.authSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } })
    return 'REVOKED' as const
  },

  revokeAllExcept({ userId, exceptSessionId }: { userId: number; exceptSessionId: number }) {
    return prisma.authSession.updateMany({
      where: { userId, revokedAt: null, id: { not: exceptSessionId } },
      data: { revokedAt: new Date() },
    })
  },

  /**
   * Marca sessao como revogada. Idempotente se ja revogada; `null` se nao existir.
   */
  async revokeById(id: number): Promise<'NOT_FOUND' | 'REVOKED'> {
    const row = await prisma.authSession.findUnique({
      where: { id },
      select: { id: true, revokedAt: true },
    })
    if (!row) return 'NOT_FOUND'
    if (row.revokedAt) return 'REVOKED'

    await prisma.authSession.update({
      where: { id },
      data: { revokedAt: new Date() },
    })
    return 'REVOKED'
  },
}
