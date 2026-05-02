import { authService } from '../../services/auth.service'
import { loginSchema } from '#shared/schemas/auth'
import { setAuthCookies } from '../../utils/cookies'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const input = loginSchema.parse(body)
    const result = await authService.login(input)

    setAuthCookies(event, result.accessToken, result.refreshToken)

    return ok({ user: result.user })
  } catch (error) {
    throw toHttpError(error)
  }
})
