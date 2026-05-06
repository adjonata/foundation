import { z } from 'zod'
import { paginationQuerySchema } from '#shared/schemas/pagination'

/** Query de GET /api/protected/admin/sessions (paginaçao). */
export const adminSessionsQuerySchema = paginationQuerySchema

export type AdminSessionsQuery = z.infer<typeof adminSessionsQuerySchema>
