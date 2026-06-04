import { prisma } from '../utils/db'

export const passwordResetRepository = {
  create(userId: number, tokenHash: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    })
  },

  findByTokenHash(tokenHash: string) {
    return prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    })
  },

  markUsed(id: number) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    })
  },

  deleteByUserId(userId: number) {
    return prisma.passwordResetToken.deleteMany({
      where: { userId },
    })
  },
}
