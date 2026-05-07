import { createError } from 'h3'
import { Role } from '../../prisma/generated/client'

/** Apenas SUPER_ADMIN pode chamar endpoints em `/api/protected/admin/*`. */
const ADMIN_API_PREFIX = '/api/protected/admin'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith(ADMIN_API_PREFIX)) return

  const auth = event.context.auth
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }
  if (auth.role !== Role.SUPER_ADMIN) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito a super administradores' })
  }
})
