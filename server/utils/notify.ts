import { notificationRepository } from '../repositories/notification.repository'

interface NotifyParams {
  userId: number
  type: string
  title: string
  body: string
}

export async function notify(params: NotifyParams): Promise<void> {
  try {
    await notificationRepository.create(params)
  } catch (err) {
    console.error('[notify] Falha ao criar notificação:', params.type, err)
  }
}
