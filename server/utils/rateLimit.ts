import { rateLimitRepository } from '../repositories/rate-limit.repository'

const AUTH_RATE_LIMIT_MAX = Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10)
const AUTH_RATE_LIMIT_WINDOW = Number(process.env.AUTH_RATE_LIMIT_WINDOW ?? 60 * 15)

export async function checkAuthRateLimit({ key }: { key: string }) {
  const attempt = await rateLimitRepository.increment({ key, windowMs: AUTH_RATE_LIMIT_WINDOW * 1000 })
  const retryAfter = Math.max(1, Math.ceil((attempt.expiresAt.getTime() - Date.now()) / 1000))

  return {
    limited: attempt.count > AUTH_RATE_LIMIT_MAX,
    retryAfter,
  }
}
