import { z } from 'zod'
import { notificationService } from '../../../services/notification.service'
import { toHttpError } from '../../../utils/errors'
import { ok } from '../../../utils/response'
import { paginationQuerySchema } from '#shared/schemas/pagination'

const querySchema = paginationQuerySchema.extend({
  showAll: z.coerce.boolean().default(false),
})

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const query = await getValidatedQuery(event, querySchema.parse)
    const params = { userId: auth.userId, page: query.page, pageSize: query.pageSize }
    const result = query.showAll
      ? await notificationService.listAll(params)
      : await notificationService.listUnread(params)
    return ok(result)
  } catch (error) {
    throw toHttpError(error)
  }
})
