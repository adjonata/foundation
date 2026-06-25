import { useIntervalFn } from '@vueuse/core'
import type { NotificationItem } from '#shared/types/notification'

export const useNotificationsStore = defineStore('notifications', () => {
  const api = useApi()

  const items = ref<NotificationItem[]>([])
  const unreadCount = ref(0)

  async function fetchUnread() {
    if (!import.meta.client) return
    try {
      const result = await api.notifications.getUnread({ pageSize: 10 })
      items.value = result.items
      unreadCount.value = result.meta.total
    } catch {}
  }

  async function markAsRead({ id }: { id: number }) {
    await api.notifications.markAsRead({ id })
    items.value = items.value.filter((n) => n.id !== id)
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  async function markAllAsRead() {
    await api.notifications.markAllAsRead()
    items.value = []
    unreadCount.value = 0
  }

  const { pause, resume } = useIntervalFn(fetchUnread, 60_000, { immediate: false, immediateCallback: false })

  function startPolling() {
    void fetchUnread()
    resume()
  }

  function stopPolling() {
    pause()
  }

  return { items, unreadCount, fetchUnread, markAsRead, markAllAsRead, startPolling, stopPolling }
})
