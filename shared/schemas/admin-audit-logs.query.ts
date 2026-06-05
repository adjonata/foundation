import { z } from 'zod'
import { paginationQuerySchema } from '#shared/schemas/pagination'

export const adminAuditLogsQuerySchema = paginationQuerySchema.extend({
  actorId: z.coerce.number().int().positive().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
})

export type AdminAuditLogsQuery = z.infer<typeof adminAuditLogsQuerySchema>
