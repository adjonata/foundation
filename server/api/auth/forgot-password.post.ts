import { forgotPasswordSchema } from '#shared/schemas/auth'
import { authService } from '../../services/auth.service'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = forgotPasswordSchema.parse(body)

    await authService.forgotPassword({ email })

    return ok({ message: 'Se esse e-mail estiver cadastrado, um link de redefinicao foi enviado.' })
  } catch (error) {
    throw toHttpError(error)
  }
})
