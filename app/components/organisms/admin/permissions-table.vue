<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminPermission } from '#shared/types/admin'

const props = defineProps<{
  rows: AdminPermission[]
  loading: boolean
}>()

function formatShortDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const columns = computed<TableColumn<AdminPermission>[]>(() => [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'w-14',
        td: 'tabular-nums text-xs text-muted',
      },
    },
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    meta: {
      class: {
        td: 'font-mono text-xs',
      },
    },
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => row.original.description?.trim() || '—',
  },
  {
    accessorKey: 'createdAt',
    header: 'Criada em',
    cell: ({ row }) => formatShortDate(row.original.createdAt),
  },
])
</script>

<template>
  <UCard>
    <template #header>
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-highlighted">Permissões</h2>
        <p class="text-sm text-muted">Catálogo persistido (tabela <code class="text-xs">Permission</code>).</p>
      </div>
    </template>

    <div class="relative">
      <UTable
        :data="props.rows"
        :columns="columns"
        :loading="props.loading"
        loading-color="primary"
        sticky
        class="min-w-full"
      />

      <div
        v-if="!props.loading && props.rows.length === 0"
        class="rounded-b-lg border-t border-default bg-elevated/40 px-4 py-10 text-center text-sm text-muted"
      >
        Nenhuma permissão na base ou catálogo ainda não populado pelo seed.
      </div>
    </div>
  </UCard>
</template>
