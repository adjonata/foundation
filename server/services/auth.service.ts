import { createHash, randomBytes } from 'node:crypto'
import type { LoginInput, RegisterInput } from '#shared/schemas/auth'
import type { AuthUser } from '#shared/types/user'
import { emailVerificationRepository } from '../repositories/email-verification.repository'
import { passwordResetRepository } from '../repositories/password-reset.repository'
import { authRepository } from '../repositories/auth.repository'
import { userRepository } from '../repositories/user.repository'
import { prisma } from '../utils/db'
import { AppError } from '../utils/errors'
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email'
import { refreshTokenTtl, signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt'
import { hashPassword, verifyPassword } from '../utils/password'

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000 // 24h
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000 // 1h

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function refreshExpiryDate() {
  const now = Date.now()
  return new Date(now + refreshTokenTtl() * 1000)
}

async function handleRefreshTokenReuse(refreshToken: string, cause: unknown) {
  const providedHash = hashToken(refreshToken)
  const session = await authRepository.findSessionByRefreshTokenHash(providedHash)
  if (!session) {
    throw new AppError('INVALID_TOKEN', 'Refresh token invalido', 401)
  }

  if (session.revokedAt || session.expiresAt.getTime() < Date.now()) {
    throw new AppError('INVALID_TOKEN', 'Sessao expirada', 401)
  }

  // JWT expirou naturalmente mas a sessao no banco ainda está ativa (janela de poucos ms
  // entre os dois TTLs): não é adulteração, apenas expiração. Não revogar tudo.
  if (cause instanceof AppError && cause.code === 'TOKEN_EXPIRED') {
    throw new AppError('INVALID_TOKEN', 'Sessao expirada', 401)
  }

  // Sessao ativa + JWT estruturalmente invalido = sinal de adulteracao — revogar tudo.
  await authRepository.revokeAllUserSessions(session.userId)
  throw new AppError('REFRESH_TOKEN_REUSE', 'Reutilizacao de refresh token detectada', 401)
}

function sanitizeUser(user: {
  id: number
  email: string
  name: string | null
  role: string
  emailVerifiedAt: Date | null
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerifiedAt !== null,
  }
}

async function issueTokenPair(user: { id: number; role: string }) {
  const draftPayload = {
    sub: String(user.id),
    role: user.role,
  }

  // Dependência circular: para assinar o JWT precisamos do sessionId (gerado pelo banco),
  // mas para criar a sessão precisamos do hash do token. Solução em duas etapas:
  // 1) cria a sessão com um placeholder aleatório para obter o sessionId;
  // 2) assina o JWT com o sessionId real e substitui o hash na mesma transação.
  // O placeholder é 32 bytes aleatórios: indecifrável sem o valor original,
  // tornando a janela entre as duas escritas inexplorável na prática.
  const session = await authRepository.createSession({
    userId: user.id,
    refreshTokenHash: hashToken(randomBytes(32).toString('hex')),
    expiresAt: refreshExpiryDate(),
  })

  const sessionId = String(session.id)
  const refreshToken = await signRefreshToken({ ...draftPayload, sessionId })

  await authRepository.updateSessionTokenHash(session.id, hashToken(refreshToken))

  const accessToken = await signAccessToken({ ...draftPayload, sessionId: String(session.id) })

  return { accessToken, refreshToken }
}

async function issueVerificationToken(userId: number) {
  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS)

  // Transação garante que duas requisições simultâneas não gerem dois tokens válidos:
  // a exclusão e a criação são atômicas — só o token mais recente fica ativo.
  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({ data: { userId, tokenHash, expiresAt } }),
  ])

  return rawToken
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
      passwordHash,
    })

    const rawToken = await issueVerificationToken(user.id)

    try {
      await sendVerificationEmail(user.email, rawToken)
    } catch (err) {
      // Envio falhou — remove o utilizador para que o mesmo e-mail possa ser
      // re-registado depois que o problema de envio estiver resolvido.
      // O token de verificação é apagado em cascata pelo banco.
      await userRepository.deleteById(user.id)
      throw err
    }

    const tokens = await issueTokenPair(user)

    return {
      user: sanitizeUser({ ...user, emailVerifiedAt: null }),
      ...tokens,
    }
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user || user.deletedAt) {
      throw new AppError('INVALID_CREDENTIALS', 'Credenciais invalidas', 401)
    }

    const validPassword = await verifyPassword(user.passwordHash, input.password)
    if (!validPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Credenciais invalidas', 401)
    }

    const tokens = await issueTokenPair(user)

    return {
      user: sanitizeUser(user),
      ...tokens,
    }
  },

  async refresh(refreshToken: string) {
    let payload: Awaited<ReturnType<typeof verifyToken>> | null = null
    try {
      payload = await verifyToken(refreshToken, 'refresh')
    } catch (err) {
      await handleRefreshTokenReuse(refreshToken, err)
    }
    if (!payload) {
      throw new AppError('INVALID_TOKEN', 'Token invalido ou expirado', 401)
    }

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
      await authRepository.revokeAllUserSessions(session.userId)
      throw new AppError('INVALID_TOKEN', 'Sessao expirada', 401)
    }

    const providedHash = hashToken(refreshToken)
    if (providedHash !== session.refreshTokenHash) {
      await authRepository.revokeAllUserSessions(session.userId)
      throw new AppError('REFRESH_TOKEN_REUSE', 'Reutilizacao de refresh token detectada', 401)
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
      ...tokens,
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
  },

  async verifyEmail(rawToken: string) {
    const tokenHash = hashToken(rawToken)
    const record = await emailVerificationRepository.findByTokenHash(tokenHash)

    if (!record) {
      throw new AppError('INVALID_TOKEN', 'Token invalido', 400)
    }
    // usedAt é verificado separadamente de expiresAt: um token usado permanece no banco
    // com usedAt preenchido para impedir reuso mesmo que ainda esteja dentro do prazo.
    if (record.usedAt) {
      throw new AppError('TOKEN_USED', 'Token ja utilizado', 400)
    }
    if (record.expiresAt < new Date()) {
      throw new AppError('TOKEN_EXPIRED', 'Token expirado', 400)
    }
    // Idempotente: se o e-mail já foi verificado por outro caminho, retorna o estado atual.
    if (record.user.emailVerifiedAt) {
      return sanitizeUser(record.user)
    }

    // Transação: marcar token como usado e verificar e-mail são atômicos.
    // Sem isso, uma falha entre as duas escritas deixaria o token "usado" mas o
    // utilizador ainda bloqueado, ou o e-mail verificado sem o token marcado.
    const [, user] = await prisma.$transaction([
      prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } }),
    ])

    return sanitizeUser(user)
  },

  async resendVerification(userId: number) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError('NOT_FOUND', 'Usuario nao encontrado', 404)
    }
    if (user.emailVerifiedAt) {
      throw new AppError('ALREADY_VERIFIED', 'E-mail ja verificado', 400)
    }

    const rawToken = await issueVerificationToken(user.id)
    await sendVerificationEmail(user.email, rawToken)
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email)

    // Não revelar se o e-mail existe ou não — resposta sempre neutra.
    if (!user || user.deletedAt) return

    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS)

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
    ])

    await sendPasswordResetEmail(user.email, rawToken)
  },

  async resetPassword(rawToken: string, newPassword: string) {
    const tokenHash = hashToken(rawToken)
    const record = await passwordResetRepository.findByTokenHash(tokenHash)

    if (!record) {
      throw new AppError('INVALID_TOKEN', 'Token invalido', 400)
    }
    if (record.usedAt) {
      throw new AppError('TOKEN_USED', 'Token ja utilizado', 400)
    }
    if (record.expiresAt < new Date()) {
      throw new AppError('TOKEN_EXPIRED', 'Token expirado', 400)
    }

    const passwordHash = await hashPassword(newPassword)

    // Transação: marcar token como usado + atualizar senha + revogar todas as sessões.
    // O updateMany com where usedAt:null é a "trava" — apenas um request concorrente
    // consegue marcar o token; os demais recebem count:0 e são rejeitados.
    await prisma.$transaction(async (tx) => {
      const marked = await tx.passwordResetToken.updateMany({
        where: { id: record.id, usedAt: null },
        data: { usedAt: new Date() },
      })
      if (marked.count === 0) {
        throw new AppError('TOKEN_USED', 'Token ja utilizado', 400)
      }
      await tx.user.update({ where: { id: record.userId }, data: { passwordHash } })
      await tx.authSession.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
    })
  },
}
