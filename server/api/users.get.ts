import { userService } from '../services/user.service'
import { toHttpError } from '../utils/errors'
import { ok } from '../utils/response'

export default defineEventHandler(async () => {
  try {
    const users = await userService.listUsers()
    return ok(users)
  } catch (error) {
    throw toHttpError(error)
  }
})
