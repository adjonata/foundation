import { createHash, randomBytes } from 'node:crypto'
import type { CreateUserInput } from '../schemas/user.schema'
import { userRepository } from '../repositories/user.repository'
import { authSessionRepository } from '../repositories/auth-session.repository'
import { prisma } from '../utils/db'
import { AppError } from '../utils/errors'
import { hashPassword, verifyPassword } from '../utils/password'
import { deleteFile } from '../utils/storage'
import { audit } from '../utils/audit'
import {
  sendEmailChangeNotification,
  sendPasswordChangedNotification,
  sendVerificationEmail,
} from '../utils/email'

function sanitize(user: {
  id: number
  email: string
  name: string | null
  role: string
  avatarUrl: string | null
  emailVerifiedAt: Date | null
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerifiedAt !== null,
    avatarUrl: user.avatarUrl,
  }
}

async function issueVerificationToken(userId: number) {
  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({ data: { userId, tokenHash, expiresAt } }),
  ])
  return rawToken
}

export const userService = {
  async listUsers() {
    return userRepository.listAll()
  },

  async createUser(input: CreateUserInput) {
    const exists = await userRepository.findByEmail(input.email)
    if (exists) {
      throw new AppError('EMAIL_IN_USE', 'Email ja cadastrado', 409)
    }
    const passwordHash = await hashPassword(input.password)
    return userRepository.create({ name: input.name, email: input.email, passwordHash })
  },

  async updateAvatar({ userId, avatarUrl }: { userId: number; avatarUrl: string }) {
    const existing = await userRepository.findById(userId)
    if (!existing) throw new AppError('NOT_FOUND', 'Utilizador não encontrado', 404)

    if (existing.avatarUrl) {
      const publicUrl = process.env.S3_PUBLIC_URL ?? ''
      const key = existing.avatarUrl.replace(`${publicUrl}/`, '')
      await deleteFile({ key }).catch(() => {})
    }

    const updated = await userRepository.updateAvatar({ userId, avatarUrl })
    return sanitize(updated)
  },

  async updateProfile({ userId, name, email }: { userId: number; name: string; email: string }) {
    const existing = await userRepository.findById(userId)
    if (!existing) throw new AppError('NOT_FOUND', 'Utilizador não encontrado', 404)

    const emailChanged = email.toLowerCase() !== existing.email.toLowerCase()

    if (emailChanged) {
      const taken = await userRepository.findByEmail(email)
      if (taken && taken.id !== userId) {
        throw new AppError('EMAIL_IN_USE', 'E-mail já cadastrado', 409)
      }
    }

    const changedFields: string[] = []
    if (name !== existing.name) changedFields.push('name')
    if (emailChanged) changedFields.push('email')

    if (changedFields.length === 0) return sanitize({ ...existing, avatarUrl: existing.avatarUrl ?? null })

    const updated = await userRepository.updateProfile({
      userId,
      name,
      ...(emailChanged ? { email: email.toLowerCase() } : {}),
    })

    if (emailChanged) {
      sendEmailChangeNotification(existing.email, email).catch(() => {})
      const rawToken = await issueVerificationToken(userId)
      sendVerificationEmail(email.toLowerCase(), rawToken).catch(() => {})
    }

    await audit({
      event: 'PROFILE_UPDATED',
      actorId: userId,
      entityId: String(userId),
      metadata: { fields: changedFields },
    })

    return sanitize(updated)
  },

  async changePassword({
    userId,
    currentPassword,
    newPassword,
    currentSessionId,
  }: {
    userId: number
    currentPassword: string
    newPassword: string
    currentSessionId: number
  }) {
    const user = await userRepository.findById(userId)
    if (!user) throw new AppError('NOT_FOUND', 'Utilizador não encontrado', 404)

    const valid = await verifyPassword(user.passwordHash, currentPassword)
    if (!valid) throw new AppError('INVALID_CREDENTIALS', 'Senha atual incorreta', 401)

    const passwordHash = await hashPassword(newPassword)
    await userRepository.updatePassword(userId, passwordHash)
    await authSessionRepository.revokeAllExcept({ userId, exceptSessionId: currentSessionId })

    sendPasswordChangedNotification(user.email).catch(() => {})
    await audit({ event: 'PASSWORD_CHANGED', actorId: userId, entityId: String(userId) })
  },

  async listMySessions({ userId, currentSessionId }: { userId: number; currentSessionId: number }) {
    const sessions = await authSessionRepository.listActiveForUser({ userId })
    return sessions.map((s) => ({
      ...s,
      isCurrent: s.id === currentSessionId,
    }))
  },

  async revokeMySession({ sessionId, userId }: { sessionId: number; userId: number }) {
    const result = await authSessionRepository.revokeByIdForUser({ sessionId, userId })
    if (result === 'NOT_FOUND') throw new AppError('NOT_FOUND', 'Sessão não encontrada', 404)
    await audit({ event: 'SESSION_REVOKED', actorId: userId, entityId: String(sessionId) })
  },
}
