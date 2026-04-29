import { createError } from 'h3'

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/admin')) return

  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }

  if (event.context.auth.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado' })
  }
})
