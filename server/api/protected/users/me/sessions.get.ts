import { userService } from '../../../../services/user.service'
import { toHttpError } from '../../../../utils/errors'
import { ok } from '../../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const sessions = await userService.listMySessions({
      userId: auth.userId,
      currentSessionId: Number(auth.sessionId),
    })
    return ok(sessions)
  } catch (error) {
    throw toHttpError(error)
  }
})
