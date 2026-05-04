import { z } from 'zod'
import { paginationQuerySchema } from '#shared/schemas/pagination'

/** Query de GET /api/protected/admin/users (pagina + busca textual). */
export const adminUsersQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
})

export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>
