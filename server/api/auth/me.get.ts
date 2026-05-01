import { authService } from '../../services/auth.service'
import { getAccessTokenFromCookie } from '../../utils/cookies'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const token = getAccessTokenFromCookie(event)
    const user = await authService.getMe(token)
    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
