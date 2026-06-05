import { authService } from '../../services/auth.service'
import { AppError, toHttpError } from '../../utils/errors'
import { ok } from '../../utils/response'

// Rota sob /api/auth/ (não /api/protected/) intencionalmente: usuários com e-mail
// não verificado precisam acessá-la, e /api/protected/ bloqueia quem não verificou.
export default defineEventHandler(async (event) => {
  try {
    if (!event.context.auth) {
      throw new AppError('UNAUTHORIZED', 'Nao autenticado', 401)
    }

    await authService.resendVerification({ userId: event.context.auth.userId })

    return ok({ sent: true })
  } catch (error) {
    throw toHttpError(error)
  }
})
