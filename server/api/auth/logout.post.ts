import { authService } from '../../services/auth.service'
import { clearAuthCookies, getRefreshTokenFromCookie } from '../../utils/cookies'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event)
    await authService.logout(refreshToken)
    clearAuthCookies(event)

    return ok({ logout: true })
  } catch (error) {
    throw toHttpError(error)
  }
})
