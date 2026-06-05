import { resetPasswordBodySchema } from '#shared/schemas/auth'
import { authService } from '../../services/auth.service'
import { toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, password } = resetPasswordBodySchema.parse(body)

    await authService.resetPassword({ rawToken: token, newPassword: password })

    return ok({ message: 'Senha redefinida com sucesso. Todas as sessoes foram encerradas.' })
  } catch (error) {
    throw toHttpError(error)
  }
})
