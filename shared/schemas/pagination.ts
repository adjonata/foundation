import { z } from 'zod'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '#shared/utils/pagination'

/** Query string comum de listagens paginadas (API). */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE)
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>
