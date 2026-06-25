import { z } from 'zod'
import { notificationService } from '../../../../services/notification.service'
import { toHttpError } from '../../../../utils/errors'
import { ok } from '../../../../utils/response'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    const { id } = await getValidatedRouterParams(event, paramsSchema.parse)
    await notificationService.markAsRead({ id, userId: auth.userId })
    return ok(null)
  } catch (error) {
    throw toHttpError(error)
  }
})
