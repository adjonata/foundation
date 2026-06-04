import { z } from 'zod'
import { paginationQuerySchema } from '#shared/schemas/pagination'

/** Query de GET /api/protected/admin/users (pagina + busca textual + filtro de desativados). */
export const adminUsersQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  showDeleted: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
})

export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>
