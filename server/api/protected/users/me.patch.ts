import { readValidatedBody } from 'h3'
import { userService } from '../../../services/user.service'
import { toHttpError } from '../../../utils/errors'
import { ok } from '../../../utils/response'
import { updateProfileSchema } from '../../../schemas/user.schema'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const input = await readValidatedBody(event, updateProfileSchema.parse)
    const user = await userService.updateProfile({ userId: auth.userId, ...input })
    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
