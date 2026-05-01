import { getAccessTokenFromCookie } from '../utils/cookies'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getAccessTokenFromCookie(event)
  if (!token) return

  try {
    const payload = await verifyToken(token, 'access')
    event.context.auth = {
      userId: Number(payload.sub),
      role: payload.role,
      sessionId: payload.sessionId
    }
  } catch {
    // Rotas publicas continuam sem contexto de auth.
    event.context.auth = undefined
  }
})
