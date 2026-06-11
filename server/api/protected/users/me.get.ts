import { userRepository } from '../../../repositories/user.repository'
import { AppError, toHttpError } from '../../../utils/errors'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const user = await userRepository.findById(auth.userId)
    if (!user) throw new AppError('NOT_FOUND', 'Utilizador não encontrado', 404)
    return ok({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerifiedAt !== null,
      avatarUrl: user.avatarUrl ?? null,
    })
  } catch (error) {
    throw toHttpError(error)
  }
})
