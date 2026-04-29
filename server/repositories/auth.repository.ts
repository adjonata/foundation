import { prisma } from '../utils/db'

type CreateSessionInput = {
  userId: number
  refreshTokenHash: string
  expiresAt: Date
}

export const authRepository = {
  createSession(input: CreateSessionInput) {
    return prisma.authSession.create({
      data: input
    })
  },

  findSessionById(id: number) {
    return prisma.authSession.findUnique({
      where: { id }
    })
  },

  revokeSession(id: number) {
    return prisma.authSession.update({
      where: { id },
      data: { revokedAt: new Date() }
    })
  },

  updateSessionTokenHash(id: number, refreshTokenHash: string) {
    return prisma.authSession.update({
      where: { id },
      data: { refreshTokenHash }
    })
  },

  revokeAllUserSessions(userId: number) {
    return prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    })
  }
}
