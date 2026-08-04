import { createError, setResponseHeader } from 'h3'
import { getClientIp } from '../utils/getClientIp'
import { checkAuthRateLimit } from '../utils/rateLimit'

/** Rotas sensiveis: 10 tentativas por 15 minutos por IP (ver AUTH_RATE_LIMIT_MAX/AUTH_RATE_LIMIT_WINDOW). */
const RATE_LIMITED_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
])

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') return

  const path = event.path.split('?')[0] ?? event.path
  if (!RATE_LIMITED_PATHS.has(path)) return

  const key = `${getClientIp(event)}:${path}`
  const { limited, retryAfter } = await checkAuthRateLimit({ key })

  if (!limited) return

  setResponseHeader(event, 'Retry-After', retryAfter)
  throw createError({
    statusCode: 429,
    statusMessage: 'Muitas tentativas. Tente novamente mais tarde.',
    data: { code: 'RATE_LIMITED', retryAfter },
  })
})
