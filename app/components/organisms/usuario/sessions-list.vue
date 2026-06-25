<script setup lang="ts">
import type { UserSession } from '#shared/types/session'

const api = useApi()
const toast = useToast()

const sessions = ref<UserSession[]>([])
const loading = ref(false)
const revoking = ref<number | null>(null)

async function fetchSessions() {
  loading.value = true
  try {
    sessions.value = await api.user.getSessions()
  } catch {
    toast.add({ title: 'Erro ao carregar sessões', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function revoke(sessionId: number) {
  revoking.value = sessionId
  try {
    await api.user.revokeSession({ sessionId })
    sessions.value = sessions.value.filter((s) => s.id !== sessionId)
    toast.add({ title: 'Sessão revogada com sucesso', color: 'success' })
  } catch {
    toast.add({ title: 'Erro ao revogar sessão', color: 'error' })
  } finally {
    revoking.value = null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(fetchSessions)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-highlighted">Sessões Ativas</h2>
          <p class="text-sm text-muted mt-0.5">Gerencie onde você está conectado.</p>
        </div>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="fetchSessions"
        />
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="animate-spin size-6 text-muted" />
    </div>

    <p v-else-if="!sessions.length" class="text-center py-8 text-sm text-muted">
      Nenhuma sessão ativa encontrada.
    </p>

    <ul v-else class="divide-y divide-default -mx-4 px-4">
      <li
        v-for="session in sessions"
        :key="session.id"
        class="py-4 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 rounded-lg bg-default shrink-0">
            <UIcon name="i-lucide-monitor" class="size-4 text-muted" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-highlighted">Sessão #{{ session.id }}</p>
              <UBadge v-if="session.isCurrent" color="primary" variant="subtle" size="sm">
                Esta sessão
              </UBadge>
            </div>
            <p class="text-xs text-muted">Iniciada em {{ formatDate(session.createdAt) }}</p>
            <p class="text-xs text-muted">Expira em {{ formatDate(session.expiresAt) }}</p>
          </div>
        </div>

        <UTooltip v-if="session.isCurrent" text="Para encerrar esta sessão, use o botão Sair">
          <UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-shield-check" disabled>
            Protegida
          </UButton>
        </UTooltip>
        <UButton
          v-else
          size="sm"
          color="error"
          variant="ghost"
          icon="i-lucide-log-out"
          :loading="revoking === session.id"
          @click="revoke(session.id)"
        >
          Revogar
        </UButton>
      </li>
    </ul>
  </UCard>
</template>
