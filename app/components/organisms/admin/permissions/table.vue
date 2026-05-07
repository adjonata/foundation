<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminPermission } from '#shared/types/admin'
import type { Pagination } from '~/composables/usePaginated'

const props = defineProps<{
  rows: AdminPermission[]
  loading: boolean
}>()

const pagination = ref<Pagination>({
  page: 1,
  pageSize: 20,
})

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

    <AtomsTable v-model:pagination="pagination" :data="props.rows" :columns="columns" :loading="props.loading" />
  </UCard>
</template>
