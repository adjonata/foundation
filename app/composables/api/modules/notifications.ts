import type { PaginatedResult } from '#shared/types/pagination'
import type { NotificationItem } from '#shared/types/notification'
import { useApiBase } from '../base'

export function useNotificationsApi() {
  const { withDefaults, execute } = useApiBase()

  function getUnread(params?: { page?: number; pageSize?: number }): Promise<PaginatedResult<NotificationItem>> {
    const query = new URLSearchParams()
    if (params?.page != null) query.set('page', String(params.page))
    if (params?.pageSize != null) query.set('pageSize', String(params.pageSize))
    const qs = query.toString()
    return execute(() =>
      $fetch<PaginatedResult<NotificationItem>>(
        `/api/protected/notifications${qs ? `?${qs}` : ''}`,
        withDefaults(),
      ),
    )
  }

  function getAll(params?: { page?: number; pageSize?: number }): Promise<PaginatedResult<NotificationItem>> {
    const query = new URLSearchParams({ showAll: 'true' })
    if (params?.page != null) query.set('page', String(params.page))
    if (params?.pageSize != null) query.set('pageSize', String(params.pageSize))
    return execute(() =>
      $fetch<PaginatedResult<NotificationItem>>(
        `/api/protected/notifications?${query.toString()}`,
        withDefaults(),
      ),
    )
  }

  function markAsRead({ id }: { id: number }): Promise<void> {
    return execute(() =>
      $fetch<void>(`/api/protected/notifications/${id}/read`, withDefaults({ method: 'patch' })),
    )
  }

  function markAllAsRead(): Promise<void> {
    return execute(() =>
      $fetch<void>('/api/protected/notifications/read-all', withDefaults({ method: 'patch' })),
    )
  }

  return { getUnread, getAll, markAsRead, markAllAsRead }
}
