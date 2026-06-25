<script setup lang="ts">
import { formatRelativeTime } from '~/utils/format-date'

const notificationsStore = useNotificationsStore()
const { items, unreadCount } = storeToRefs(notificationsStore)

const open = ref(false)

onMounted(() => notificationsStore.startPolling())
onUnmounted(() => notificationsStore.stopPolling())

async function handleMarkAsRead(id: number) {
  await notificationsStore.markAsRead({ id })
}

async function handleMarkAllAsRead() {
  await notificationsStore.markAllAsRead()
}

const bellLabel = computed(() =>
  unreadCount.value > 0
    ? `${unreadCount.value} notificaç${unreadCount.value === 1 ? 'ão não lida' : 'ões não lidas'}`
    : 'Sem notificações não lidas',
)
</script>

<template>
  <UPopover v-model:open="open">
    <div class="relative inline-flex">
      <UButton size="sm" color="neutral" variant="ghost" square icon="i-lucide-bell" :aria-label="bellLabel" />
      <span
        v-if="unreadCount > 0"
        class="pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </div>

    <template #content>
      <div class="w-80">
        <!-- cabeçalho -->
        <div class="flex items-center justify-between border-b border-default px-4 py-3">
          <span class="text-sm font-semibold">Notificações</span>
          <UButton
            v-if="unreadCount > 0"
            size="xs"
            color="neutral"
            variant="ghost"
            label="Marcar todas"
            icon="i-lucide-check-check"
            @click="handleMarkAllAsRead"
          />
        </div>

        <!-- lista -->
        <div class="max-h-80 overflow-y-auto">
          <template v-if="items.length === 0">
            <div class="flex flex-col items-center gap-2 px-4 py-8 text-muted">
              <UIcon name="i-lucide-bell-off" class="h-6 w-6" />
              <span class="text-sm">Sem notificações</span>
            </div>
          </template>

          <div
            v-for="notification in items"
            :key="notification.id"
            class="flex items-start gap-3 border-b border-default px-4 py-3 last:border-0 hover:bg-elevated"
          >
            <UIcon name="i-lucide-bell" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ notification.title }}</p>
              <p class="line-clamp-2 text-xs text-muted">{{ notification.body }}</p>
              <p class="mt-1 text-[11px] text-muted">{{ formatRelativeTime(notification.createdAt) }}</p>
            </div>
            <UButton
              size="md"
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-x"
              aria-label="Marcar como lida"
              @click="handleMarkAsRead(notification.id)"
            />
          </div>
        </div>

        <!-- rodapé -->
        <div class="border-t border-default px-4 py-2">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            label="Ver histórico completo"
            trailing-icon="i-lucide-arrow-right"
            to="/notificacoes"
            class="w-full justify-between"
            @click="open = false"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
