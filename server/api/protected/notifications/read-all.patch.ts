import { notificationService } from '../../../services/notification.service'
import { toHttpError } from '../../../utils/errors'
import { ok } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth!
    await notificationService.markAllAsRead({ userId: auth.userId })
    return ok(null)
  } catch (error) {
    throw toHttpError(error)
  }
})
