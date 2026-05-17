import { z } from 'zod'
import { authService } from '../../services/auth.service'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

const bodySchema = z.object({
  token: z.string().min(1, 'Token obrigatorio'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token } = bodySchema.parse(body)

    const user = await authService.verifyEmail(token)

    return ok(user)
  } catch (error) {
    throw toHttpError(error)
  }
})
