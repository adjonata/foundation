<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminRoleWithPermissions } from '#shared/types/admin'
import type { Pagination } from '~/composables/usePaginated'

const props = defineProps<{
  rows: AdminRoleWithPermissions[]
  loading: boolean
}>()

const pagination = ref<Pagination>({
  page: 1,
  pageSize: 20,
})

type FlatRow = {
  role: string
  permissionName: string
  permissionDescription: string | null
}

const tableData = computed<FlatRow[]>(() => {
  const out: FlatRow[] = []
  for (const entry of props.rows) {
    if (!entry.permissions.length) {
      out.push({
        role: entry.role,
        permissionName: '—',
        permissionDescription: null,
      })
      continue
    }
    for (const p of entry.permissions) {
      out.push({
        role: entry.role,
        permissionName: p.name,
        permissionDescription: p.description,
      })
    }
  }
  return out
})

const columns = computed<TableColumn<FlatRow>[]>(() => [
  {
    accessorKey: 'role',
    header: 'Papel',
    meta: {
      class: {
        td: 'align-top',
      },
    },
  },
  {
    accessorKey: 'permissionName',
    header: 'Permissão',
    meta: {
      class: {
        td: 'align-top font-mono text-xs',
      },
    },
  },
  {
    accessorKey: 'permissionDescription',
    header: 'Descrição',
    cell: ({ row }) => row.original.permissionDescription?.trim() || '—',
    meta: {
      class: {
        td: 'align-top text-muted',
      },
    },
  },
])
</script>

<template>
  <UCard>
    <template #header>
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-highlighted">Papéis e permissões</h2>
        <p class="text-sm text-muted">
          Vínculos <code class="text-xs">RolePermission</code> por papel (uma linha por permissão).
        </p>
      </div>
    </template>

    <AtomsTable v-model:pagination="pagination" :data="tableData" :columns="columns" :loading="props.loading">
      <template #role-role="{ row }">
        <AtomsRoleBadge :role="row.original.role" show-code />
      </template>
    </AtomsTable>
  </UCard>
</template>
