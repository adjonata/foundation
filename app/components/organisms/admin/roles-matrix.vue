<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminRoleWithPermissions } from '#shared/types/admin'

const props = defineProps<{
  rows: AdminRoleWithPermissions[]
  loading: boolean
}>()

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

    <div class="relative">
      <UTable
        :data="tableData"
        :columns="columns"
        :loading="props.loading"
        loading-color="primary"
        sticky
        class="min-w-full"
      >
        <template #role-cell="{ row }">
          <AtomsRoleBadge :role="row.original.role" show-code />
        </template>
      </UTable>

      <div
        v-if="!props.loading && !tableData.length"
        class="rounded-b-lg border-t border-default bg-elevated/40 px-4 py-10 text-center text-sm text-muted"
      >
        Nenhum papel com permissões no catálogo; volte após aplicar seed.
      </div>
    </div>
  </UCard>
</template>
