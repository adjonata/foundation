import { createUserSchema } from '../schemas/user.schema'
import { userService } from '../services/user.service'
import { toHttpError } from '../utils/errors'
import { ok } from '../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const input = createUserSchema.parse(body)
    const user = await userService.createUser(input)
    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
