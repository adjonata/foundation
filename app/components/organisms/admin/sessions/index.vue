<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { AdminSessionListItem } from '#shared/types/admin'

const api = useApi()
const toast = useToast()

const { pagination, items, loading, requestError, execute, upaginationProps, totalCount, pageRangeLabel } =
  usePaginated<AdminSessionListItem, Record<string, never>>({
    autoExecute: true,
    onRequestError: (message) => {
      toast.add({
        title: 'Erro ao carregar sessões',
        description: message,
        color: 'error',
      })
    },
    request: (p) =>
      api.admin.listSessions({
        page: p.page,
        pageSize: p.pageSize,
      }),
  })

async function revoke(session: AdminSessionListItem) {
  try {
    await api.admin.revokeSession(session.id)
    toast.add({
      title: 'Sessão revogada',
      description: `Sessão de ${session.user.email} revogada com sucesso.`,
      color: 'success',
    })
    await execute()
  } catch (error: unknown) {
    toast.add({
      title: 'Não foi possível revogar a sessão',
      description: getFetchErrorMessage(error),
      color: 'error',
    })
  }
}

function sessionActions(session: AdminSessionListItem): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Revogar sessão',
        icon: 'i-lucide-shield-x',
        color: 'error',
        onSelect: () => {
          void revoke(session)
        },
      },
    ],
  ]
}

const columns = computed<TableColumn<AdminSessionListItem>[]>(() => [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        td: 'tabular-nums text-xs text-muted',
      },
    },
  },
  {
    id: 'email',
    header: 'E-mail',
    cell: ({ row }) => row.original.user.email,
  },
  {
    id: 'name',
    header: 'Nome',
    cell: ({ row }) => row.original.user.name?.trim() || '—',
  },
  {
    id: 'role',
    header: 'Papel',
    cell: ({ row }) => row.original.user.role,
  },
  {
    accessorKey: 'createdAt',
    header: 'Criada em',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expira em',
    cell: ({ row }) => formatDate(row.original.expiresAt),
  },
])
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="requestError"
      color="error"
      variant="subtle"
      title="Não foi possível carregar as sessões"
      :description="requestError"
      icon="i-lucide-alert-circle"
    />

    <AtomsTable
      v-model:pagination="pagination"
      :data="items"
      :columns="columns"
      :loading="loading"
      :actions-options="sessionActions"
      :total-items="totalCount"
      :pagination-props="upaginationProps"
      :page-range-label="pageRangeLabel"
    >
      <template #role-role="{ row }">
        <AtomsRoleBadge :role="row.original.user.role" />
      </template>
    </AtomsTable>
  </div>
</template>
