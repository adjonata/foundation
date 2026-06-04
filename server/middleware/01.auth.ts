import { createError } from 'h3'
import { userRepository } from '../repositories/user.repository'
import { getAccessTokenFromCookie } from '../utils/cookies'
import { verifyToken } from '../utils/jwt'

/** Rotas em `server/api/protected/**` (inclui admin em `protected/admin`) exigem sessao valida; ajuste o path se renomear a pasta. */
const PROTECTED_API_PREFIX = '/api/protected'

export default defineEventHandler(async (event) => {
  const token = getAccessTokenFromCookie(event)
  if (token) {
    try {
      const payload = await verifyToken(token, 'access')
      event.context.auth = {
        userId: Number(payload.sub),
        role: payload.role,
        sessionId: payload.sessionId,
      }
    } catch {
      event.context.auth = undefined
    }
  }

  if (!event.path.startsWith(PROTECTED_API_PREFIX)) return

  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }

  // A verificação de e-mail é feita via banco (não no JWT) para que o desbloqueio
  // seja imediato após confirmar o link, sem exigir novo login ou refresh de token.
  const user = await userRepository.findById(event.context.auth.userId)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Conta desativada' })
  }
  if (!user.emailVerifiedAt) {
    throw createError({ statusCode: 403, statusMessage: 'E-mail nao verificado', data: { code: 'EMAIL_NOT_VERIFIED' } })
  }
})
