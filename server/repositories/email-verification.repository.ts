import { prisma } from '../utils/db'

export const emailVerificationRepository = {
  create(userId: number, tokenHash: string, expiresAt: Date) {
    return prisma.emailVerificationToken.create({
      data: { userId, tokenHash, expiresAt },
    })
  },

  findByTokenHash(tokenHash: string) {
    // Inclui o user para evitar uma segunda query no service ao validar e-mail e role.
    return prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    })
  },

  markUsed(id: number) {
    return prisma.emailVerificationToken.update({
      where: { id },
      data: { usedAt: new Date() },
    })
  },

  // Apaga tokens anteriores do utilizador antes de emitir um novo.
  deleteByUserId(userId: number) {
    return prisma.emailVerificationToken.deleteMany({
      where: { userId },
    })
  },
}
