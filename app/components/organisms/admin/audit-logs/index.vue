<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminAuditLogItem } from '#shared/types/admin'

const api = useApi()
const toast = useToast()

const actionFilter = ref<string>('')
const entityFilter = ref<string>('')
const fromFilter = ref<string>('')
const toFilter = ref<string>('')

function formatMetadata(metadata: Record<string, unknown>): string {
  const entries = Object.entries(metadata)
  if (entries.length === 0) return '—'
  return entries.map(([k, v]) => `${k}: ${v}`).join(' · ')
}

function toIso(datetimeLocal: string): string | undefined {
  if (!datetimeLocal) return undefined
  return new Date(datetimeLocal).toISOString()
}

const { pagination, items, loading, requestError, goToFirstPage, upaginationProps, totalCount, pageRangeLabel } =
  usePaginated<AdminAuditLogItem, Record<string, never>>({
    autoExecute: true,
    onRequestError: (message) => {
      toast.add({
        title: 'Erro ao carregar registos',
        description: message,
        color: 'error',
      })
    },
    request: (p) =>
      api.admin.listAuditLogs({
        page: p.page,
        pageSize: p.pageSize,
        action: actionFilter.value || undefined,
        entity: entityFilter.value || undefined,
        from: toIso(fromFilter.value),
        to: toIso(toFilter.value),
      }),
  })

watch([actionFilter, entityFilter], () => goToFirstPage(), { flush: 'post' })
watch([fromFilter, toFilter], () => goToFirstPage())

const columns = computed<TableColumn<AdminAuditLogItem>[]>(() => [
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => formatDate(row.original.createdAt),
    meta: { class: { td: 'whitespace-nowrap tabular-nums text-sm' } },
  },
  {
    accessorKey: 'action',
    header: 'Ação',
  },
  {
    accessorKey: 'entity',
    header: 'Entidade',
    meta: { class: { td: 'text-muted text-sm' } },
  },
  {
    id: 'actor',
    header: 'Ator',
    cell: ({ row }) => row.original.actor?.email ?? 'Sistema',
    meta: { class: { td: 'text-sm' } },
  },
  {
    id: 'metadata',
    header: 'Detalhes',
    cell: ({ row }) => formatMetadata(row.original.metadata),
    meta: { class: { td: 'text-muted text-sm max-w-xs truncate' } },
  },
])
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="requestError"
      color="error"
      variant="subtle"
      title="Não foi possível carregar os registos"
      :description="requestError"
      icon="i-lucide-alert-circle"
    />

    <UCard :ui="{ body: 'p-0 sm:p-0 space-y-0' }">
      <template #header>
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-highlighted">Registos de auditoria</h2>
          <p class="text-sm text-muted">Histórico de ações executadas no sistema.</p>
        </div>
      </template>

      <div class="grid gap-3 border-b border-default px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <UInput v-model="actionFilter" placeholder="Ação (ex: LOGIN)" icon="i-lucide-zap" />
        <UInput v-model="entityFilter" placeholder="Entidade (ex: User)" icon="i-lucide-box" />
        <UInput v-model="fromFilter" type="datetime-local" :ui="{ base: 'text-sm' }" />
        <UInput v-model="toFilter" type="datetime-local" :ui="{ base: 'text-sm' }" />
      </div>

      <div class="relative px-0 pb-0 sm:px-0">
        <AtomsTable
          v-model:pagination="pagination"
          :data="items"
          :columns="columns"
          :loading="loading"
          :total-items="totalCount"
          :pagination-props="upaginationProps"
          :page-range-label="pageRangeLabel"
        />
      </div>
    </UCard>
  </div>
</template>
