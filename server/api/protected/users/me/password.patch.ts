import { readValidatedBody } from 'h3'
import { userService } from '../../../../services/user.service'
import { toHttpError } from '../../../../utils/errors'
import { ok } from '../../../../utils/response'
import { changePasswordSchema } from '../../../../schemas/user.schema'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const input = await readValidatedBody(event, changePasswordSchema.parse)
    await userService.changePassword({
      userId: auth.userId,
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
      currentSessionId: Number(auth.sessionId),
    })
    return ok(null)
  } catch (error) {
    throw toHttpError(error)
  }
})
