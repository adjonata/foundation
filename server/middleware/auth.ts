import { createError } from 'h3'
import { getAccessTokenFromCookie } from '../utils/cookies'
import { verifyToken } from '../utils/jwt'

/** Rotas em `server/api/protected/**` exigem sessao valida; ajuste o path se renomear a pasta. */
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

  if (event.path.startsWith(PROTECTED_API_PREFIX) && !event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }
})
