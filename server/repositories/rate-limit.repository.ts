import { prisma } from '../utils/db'

export const rateLimitRepository = {
  async increment({ key, windowMs }: { key: string; windowMs: number }) {
    const now = new Date()

    return prisma.$transaction(async (tx) => {
      const existing = await tx.rateLimitAttempt.findUnique({ where: { key } })

      if (!existing || existing.expiresAt <= now) {
        return tx.rateLimitAttempt.upsert({
          where: { key },
          create: { key, count: 1, expiresAt: new Date(now.getTime() + windowMs) },
          update: { count: 1, expiresAt: new Date(now.getTime() + windowMs) },
        })
      }

      return tx.rateLimitAttempt.update({
        where: { key },
        data: { count: { increment: 1 } },
      })
    })
  },
}
