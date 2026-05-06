import type { Prisma } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

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
}
