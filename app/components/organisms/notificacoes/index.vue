<script setup lang="ts">
import type { NotificationItem } from '#shared/types/notification'
import { formatDate, formatRelativeTime } from '~/utils/format-date'

const api = useApi()
const notificationsStore = useNotificationsStore()
const toast = useToast()

const { items, pagination, execute, loading, meta, shouldShowPagination, upaginationProps, pageRangeLabel } =
  usePaginated<NotificationItem>({
    request: (p) => api.notifications.getAll({ page: p.page, pageSize: p.pageSize }),
    autoExecute: true,
  })

async function handleMarkAsRead(id: number) {
  try {
    await notificationsStore.markAsRead({ id })
    const target = items.value.find((n) => n.id === id)
    if (target) target.readAt = new Date().toISOString()
  } catch {
    toast.add({ title: 'Erro ao marcar notificação', color: 'error' })
  }
}

async function handleMarkAllAsRead() {
  try {
    await notificationsStore.markAllAsRead()
    await execute()
  } catch {
    toast.add({ title: 'Erro ao marcar notificações', color: 'error' })
  }
}
</script>

<template>
  <div>
    <!-- cabeçalho -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">Notificações</h1>
        <p v-if="meta" class="mt-1 text-sm text-muted">
          {{ meta.total }} notificaç{{ meta.total === 1 ? 'ão' : 'ões' }}
        </p>
      </div>
      <UButton
        v-if="notificationsStore.unreadCount > 0"
        color="neutral"
        variant="outline"
        icon="i-lucide-check-check"
        label="Marcar todas como lidas"
        @click="handleMarkAllAsRead"
      />
    </div>

    <!-- loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="h-6 w-6 animate-spin text-muted" />
    </div>

    <!-- vazio -->
    <div v-else-if="items.length === 0" class="rounded-lg border border-default py-16 text-center">
      <UIcon name="i-lucide-bell-off" class="mx-auto mb-3 h-8 w-8 text-muted" />
      <p class="font-medium">Sem notificações</p>
      <p class="mt-1 text-sm text-muted">Você está em dia com tudo.</p>
    </div>

    <!-- lista -->
    <div v-else class="divide-y divide-default rounded-lg border border-default">
      <div
        v-for="notification in items"
        :key="notification.id"
        class="flex items-start gap-4 px-5 py-4 transition-colors"
        :class="{ 'bg-primary/5': !notification.readAt }"
      >
        <span
          class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
          :class="notification.readAt ? 'bg-transparent' : 'bg-primary'"
        />

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="font-medium" :class="{ 'text-muted': !!notification.readAt }">
              {{ notification.title }}
            </p>
            <span class="shrink-0 text-xs text-muted" :title="formatDate(notification.createdAt)">
              {{ formatRelativeTime(notification.createdAt) }}
            </span>
          </div>
          <p class="mt-0.5 text-sm text-muted">{{ notification.body }}</p>
        </div>

        <UButton
          v-if="!notification.readAt"
          size="md"
          color="neutral"
          variant="ghost"
          square
          icon="i-lucide-check"
          aria-label="Marcar como lida"
          @click="handleMarkAsRead(notification.id)"
        />
      </div>
    </div>

    <!-- paginação -->
    <div v-if="shouldShowPagination" class="mt-6 flex items-center justify-between text-sm text-muted">
      <span v-if="pageRangeLabel">Página {{ pageRangeLabel.current }} de {{ pageRangeLabel.pageCount }}</span>
      <UPagination v-bind="upaginationProps" v-model:page="pagination.page" class="ml-auto" />
    </div>
  </div>
</template>
