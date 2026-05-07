<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Pagination } from '~/composables/usePaginated'
import { upperFirst } from 'scule'

type TableActionItems = DropdownMenuItem[] | DropdownMenuItem[][]

const props = withDefaults(
  defineProps<{
    data: any[]
    columns: TableColumn<any>[]
    loading?: boolean
    showSelectionSummary?: boolean
    actionsOptions?: ((row: any) => TableActionItems) | null
    actionsColumnId?: string
    actionsColumnLabel?: string
    paginationProps?: Record<string, unknown>
    pageRangeLabel?: { current: number; pageCount: number } | null
    totalItems?: number | null
  }>(),
  {
    loading: false,
    showSelectionSummary: false,
    actionsOptions: null,
    actionsColumnId: 'actions',
    actionsColumnLabel: '',
    paginationProps: undefined,
    pageRangeLabel: null,
    totalItems: null,
  },
)

const paginationModel = defineModel<Pagination>('pagination', { required: true })
const table = ref<any>(null)
const slots = useSlots()

function getColumnKey(column: TableColumn<any>) {
  const anyColumn = column as { id?: string; accessorKey?: string }
  return String(anyColumn.id ?? anyColumn.accessorKey ?? '')
}

function normalizeActionItems(items: TableActionItems): DropdownMenuItem[][] {
  const first = items[0]
  if (Array.isArray(first)) return items as DropdownMenuItem[][]
  return [items as DropdownMenuItem[]]
}

function getActionItems(row: any): DropdownMenuItem[][] {
  if (!props.actionsOptions) return []
  return normalizeActionItems(props.actionsOptions(row))
}

function hasRoleSlot(columnKey: string) {
  return Boolean(slots[`role-${columnKey}`])
}

function isActionsColumn(columnKey: string) {
  return props.actionsOptions != null && columnKey === props.actionsColumnId
}

const resolvedColumns = computed<TableColumn<any>[]>(() => {
  if (!props.actionsOptions) return props.columns

  const hasActionsColumn = props.columns.some((column) => getColumnKey(column) === props.actionsColumnId)
  if (hasActionsColumn) return props.columns

  return [
    ...props.columns,
    {
      id: props.actionsColumnId,
      header: props.actionsColumnLabel,
      meta: {
        class: {
          th: 'w-12',
          td: 'text-end',
        },
      },
    },
  ]
})

const columnsWithCustomCell = computed<TableColumn<any>[]>(() =>
  resolvedColumns.value.filter((column) => {
    const key = getColumnKey(column)
    return hasRoleSlot(key) || isActionsColumn(key)
  }),
)

const visibleColumns = computed<any[]>(() => {
  const api = table.value?.tableApi
  if (!api) return []

  return api
    .getAllColumns()
    .filter((column: any) => column.getCanHide())
    .map((column: any) => ({
      label: upperFirst(column.id),
      type: 'checkbox' as const,
      checked: column.getIsVisible(),
      onUpdateChecked(checked: boolean) {
        table.value?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
      },
      onSelect(e: Event) {
        e.preventDefault()
      },
    }))
})
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput v-model="paginationModel.search" class="max-w-sm min-w-[12ch]" placeholder="Buscar" />

      <UDropdownMenu :items="visibleColumns" :content="{ align: 'end' }">
        <UButton
          label="Colunas"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          class="ml-auto"
          aria-label="Selecionar colunas da tabela"
        />
      </UDropdownMenu>
    </div>

    <UTable
      ref="table"
      :loading="loading"
      loading-color="primary"
      :data="data"
      :columns="resolvedColumns"
      sticky
      class="min-w-full"
    >
      <template
        v-for="column in columnsWithCustomCell"
        :key="getColumnKey(column)"
        #[`${getColumnKey(column)}-cell`]="slotProps"
      >
        <slot v-if="hasRoleSlot(getColumnKey(column))" :name="`role-${getColumnKey(column)}`" v-bind="slotProps" />
        <UDropdownMenu
          v-else-if="isActionsColumn(getColumnKey(column))"
          :items="getActionItems(slotProps.row.original)"
          :disabled="loading"
          :content="{ align: 'end' }"
          aria-label="Ações da linha"
        >
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            aria-label="Abrir ações da linha"
          />
        </UDropdownMenu>
      </template>

      <template #loading>
        <div class="inline-flex items-center gap-2 text-sm text-muted">
          <Icon name="i-lucide-loader-circle" class="h-4 w-4 animate-spin" />
          <span>A carregar dados...</span>
        </div>
      </template>

      <template #empty>
        <div v-if="!loading" class="text-center text-sm text-muted">Nenhum resultado para os filtros atuais.</div>
      </template>
    </UTable>

    <div v-if="showSelectionSummary" class="px-4 py-3.5 text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} linha(s) selecionada(s).
    </div>

    <div
      v-if="pageRangeLabel && paginationProps"
      class="flex flex-col gap-4 border-t border-default px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <p class="text-sm text-muted">
        <span v-if="totalItems != null">Total: {{ totalItems }} · </span>
        Página {{ pageRangeLabel.current }} de {{ pageRangeLabel.pageCount }}
      </p>
      <UPagination v-model:page="paginationModel.page" :disabled="loading" v-bind="paginationProps" />
    </div>
  </div>
</template>
