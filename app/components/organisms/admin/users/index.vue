<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { AdminUserListItem } from '#shared/types/admin'
import { prismaRoleSlugs } from '#shared/constants/prisma-roles'
import { getRoleDisplayLabel } from '#shared/utils/roleDisplay'

const api = useApi()
const toast = useToast()

const { pagination, items, loading, requestError, upaginationProps, totalCount, pageRangeLabel } = usePaginated<
  AdminUserListItem,
  Record<string, never>
>({
  initialPagination: { search: '' },
  debounceSearchMs: 400,
  autoExecute: true,
  onRequestError: (message) => {
    toast.add({
      title: 'Erro ao carregar utilizadores',
      description: message,
      color: 'error',
    })
  },
  request: (p) =>
    api.admin.listUsers({
      page: p.page,
      pageSize: p.pageSize,
      search: p.search || undefined,
    }),
})

async function applyRole(user: AdminUserListItem, newRole: (typeof prismaRoleSlugs)[number]) {
  if (user.role === newRole) return
  requestError.value = null
  try {
    const updated = await api.admin.updateUserRole(user.id, { role: newRole })
    const idx = items.value.findIndex((r: AdminUserListItem) => r.id === updated.id)
    if (idx >= 0) items.value[idx] = updated
    toast.add({
      title: 'Papel atualizado',
      description: `${updated.email}: ${getRoleDisplayLabel(updated.role)}`,
      color: 'success',
    })
  } catch (error: unknown) {
    toast.add({
      title: 'Não foi possível alterar o papel',
      description: getFetchErrorMessage(error),
      color: 'error',
    })
  }
}

async function sendVerification(user: AdminUserListItem) {
  try {
    await api.admin.resendVerificationForUser(user.id)
    toast.add({
      title: 'E-mail reenviado',
      description: `Verificação enviada para ${user.email}`,
      color: 'success',
    })
  } catch (error: unknown) {
    toast.add({
      title: 'Não foi possível reenviar',
      description: getFetchErrorMessage(error),
      color: 'error',
    })
  }
}

function actionMenuItems(user: AdminUserListItem): DropdownMenuItem[][] {
  const groups: DropdownMenuItem[][] = [
    prismaRoleSlugs.map((slug) => ({
      label: getRoleDisplayLabel(slug),
      description: slug,
      disabled: user.role === slug,
      onSelect: () => {
        void applyRole(user, slug)
      },
    })),
  ]

  if (!user.emailVerified) {
    groups.push([
      {
        label: 'Reenviar verificação',
        icon: 'i-lucide-mail',
        onSelect: () => {
          void sendVerification(user)
        },
      },
    ])
  }

  return groups
}

const columns = computed<TableColumn<AdminUserListItem>[]>(() => [
  {
    accessorKey: 'email',
    header: 'E-mail',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.original.name?.trim() || '—',
    meta: {
      class: {
        td: 'max-w-[12rem] truncate',
      },
    },
  },
  {
    accessorKey: 'role',
    header: 'Papel',
  },
  {
    accessorKey: 'emailVerified',
    header: 'Verificado',
  },
  {
    accessorKey: 'createdAt',
    header: 'Registo',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
])
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="requestError"
      color="error"
      variant="subtle"
      title="Falhou o carregamento da listagem"
      :description="requestError"
      icon="i-lucide-alert-circle"
    />

    <UCard :ui="{ body: 'p-0 sm:p-0 space-y-0' }">
      <template #header>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-highlighted">Lista de utilizadores</h2>
            <p class="text-sm text-muted">
              Busca em e-mail ou nome; alteração de papel com efeito imediato no servidor.
            </p>
          </div>
        </div>
      </template>

      <div class="relative px-0 pb-0 sm:px-0">
        <AtomsTable
          v-model:pagination="pagination"
          :data="items"
          :columns="columns"
          :loading="loading"
          :actions-options="actionMenuItems"
          :total-items="totalCount"
          :pagination-props="upaginationProps"
          :page-range-label="pageRangeLabel"
        >
          <template #role-role="{ row }">
            <AtomsRoleBadge :role="row.original.role" />
          </template>
          <template #role-emailVerified="{ row }">
            <UBadge
              :color="row.original.emailVerified ? 'success' : 'neutral'"
              variant="subtle"
              :label="row.original.emailVerified ? 'Sim' : 'Não'"
            />
          </template>
        </AtomsTable>
      </div>
    </UCard>
  </div>
</template>
