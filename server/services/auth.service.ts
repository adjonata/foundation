import { createHash } from 'node:crypto'
import type { LoginInput, RegisterInput } from '#shared/schemas/auth'
import type { AuthUser } from '#shared/types/user'
import { authRepository } from '../repositories/auth.repository'
import { userRepository } from '../repositories/user.repository'
import { AppError } from '../utils/errors'
import { refreshTokenTtl, signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt'
import { hashPassword, verifyPassword } from '../utils/password'

function hashRefreshToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function refreshExpiryDate() {
  const now = Date.now()
  return new Date(now + refreshTokenTtl() * 1000)
}

function sanitizeUser(user: { id: number, email: string, name: string | null, role: string }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}

async function issueTokenPair(user: { id: number, role: string }) {
  const draftPayload = {
    sub: String(user.id),
    role: user.role
  }

  const session = await authRepository.createSession({
    userId: user.id,
    refreshTokenHash: hashRefreshToken('pending'),
    expiresAt: refreshExpiryDate()
  })

  const sessionId = String(session.id)
  const refreshToken = await signRefreshToken({ ...draftPayload, sessionId })

  await authRepository.updateSessionTokenHash(session.id, hashRefreshToken(refreshToken))

  const accessToken = await signAccessToken({ ...draftPayload, sessionId: String(session.id) })

  return { accessToken, refreshToken }
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email)
    if (existingUser) {
      throw new AppError('EMAIL_IN_USE', 'Email ja cadastrado', 409)
    }

    const passwordHash = await hashPassword(input.password)
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    })

    const tokens = await issueTokenPair(user)

    return {
      user: sanitizeUser(user),
      ...tokens
    }
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Credenciais invalidas', 401)
    }

    const validPassword = await verifyPassword(user.passwordHash, input.password)
    if (!validPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Credenciais invalidas', 401)
    }

    const tokens = await issueTokenPair(user)

    return {
      user: sanitizeUser(user),
      ...tokens
    }
  },

  async refresh(refreshToken: string) {
    const payload = await verifyToken(refreshToken, 'refresh')
    const sessionId = Number(payload.sessionId)
    if (!Number.isFinite(sessionId)) {
      throw new AppError('INVALID_TOKEN', 'Sessao invalida', 401)
    }

    const session = await authRepository.findSessionById(sessionId)
    if (!session) {
      throw new AppError('INVALID_TOKEN', 'Sessao nao encontrada', 401)
    }
    if (session.revokedAt) {
      throw new AppError('INVALID_TOKEN', 'Sessao revogada', 401)
    }
    if (session.expiresAt.getTime() < Date.now()) {
      throw new AppError('INVALID_TOKEN', 'Sessao expirada', 401)
    }

    const providedHash = hashRefreshToken(refreshToken)
    if (providedHash !== session.refreshTokenHash) {
      throw new AppError('INVALID_TOKEN', 'Refresh token invalido', 401)
    }

    const userId = Number(payload.sub)
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError('INVALID_TOKEN', 'Usuario nao encontrado', 401)
    }

    await authRepository.revokeSession(session.id)

    const tokens = await issueTokenPair(user)

    return {
      user: sanitizeUser(user),
      ...tokens
    }
  },

  async logout(refreshToken?: string) {
    if (!refreshToken) return

    try {
      const payload = await verifyToken(refreshToken, 'refresh')
      const sessionId = Number(payload.sessionId)
      if (!Number.isFinite(sessionId)) return
      await authRepository.revokeSession(sessionId)
    } catch {
      // Token invalido no logout nao deve quebrar resposta.
    }
  },

  async getMe(accessToken: string | undefined) {
    if (!accessToken) {
      throw new AppError('UNAUTHORIZED', 'Nao autenticado', 401)
    }

    const payload = await verifyToken(accessToken, 'access')
    const sessionId = Number(payload.sessionId)
    if (!Number.isFinite(sessionId)) {
      throw new AppError('INVALID_TOKEN', 'Sessao invalida', 401)
    }

    const session = await authRepository.findSessionById(sessionId)
    if (!session || session.revokedAt) {
      throw new AppError('INVALID_TOKEN', 'Sessao invalida', 401)
    }
    if (session.expiresAt.getTime() < Date.now()) {
      throw new AppError('INVALID_TOKEN', 'Sessao expirada', 401)
    }

    const userId = Number(payload.sub)
    if (!Number.isFinite(userId) || session.userId !== userId) {
      throw new AppError('INVALID_TOKEN', 'Sessao invalida', 401)
    }

    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError('INVALID_TOKEN', 'Usuario nao encontrado', 401)
    }

    return sanitizeUser(user)
  }
}
