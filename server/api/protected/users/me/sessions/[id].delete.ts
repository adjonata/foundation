import { getRouterParam } from 'h3'
import { userService } from '../../../../../services/user.service'
import { AppError, toHttpError } from '../../../../../utils/errors'
import { ok } from '../../../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const idParam = getRouterParam(event, 'id')
    const sessionId = Number(idParam)
    if (!Number.isFinite(sessionId)) {
      throw new AppError('INVALID_INPUT', 'ID de sessão inválido', 400)
    }
    await userService.revokeMySession({ sessionId, userId: auth.userId })
    return ok(null)
  } catch (error) {
    throw toHttpError(error)
  }
})
