import { useDebounce } from '@vueuse/core'
import type { PaginationQuery } from '#shared/schemas/pagination'
import type { PaginatedMeta } from '#shared/types/pagination'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '#shared/utils/pagination'
import { getFetchErrorMessage } from '~/utils/fetchError'

/** Estado de página alinhado à query de listagens, busca opcional e `UPagination`. */
export type Pagination = Pick<PaginationQuery, 'page' | 'pageSize'> & {
  search?: string
}

export type UsePaginatedOptions<T, TExtraParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>> = {
  /**
   * Pedido à API (ou serviço): recebe os valores actuais de paginação e parâmetros extra.
   * O resultado preenche `items` e `meta` dentro de `execute`.
   */
  request: (
    pagination: Pagination,
    extraParams: TExtraParams,
  ) => Promise<{
    items: T[]
    meta: PaginatedMeta
  }>
  initialPagination?: Partial<Pagination>
  initialExtraParams?: TExtraParams
  /**
   * Quando definido, expõe `searchInput` (v-model) e preenche `pagination.search` via `useDebounce` (VueUse).
   */
  debounceSearchMs?: number
  /** Observa `pagination` e chama `execute` automaticamente. */
  autoExecute?: boolean
  /** Chamado após falha do pedido (items e meta já limpos). */
  onRequestError?: (message: string) => void
}

/**
 * Listagem paginada: estado, `execute`, loading, erro opcional e busca com debounce opcional.
 */
export function usePaginated<T, TExtraParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>>(
  options: UsePaginatedOptions<T, TExtraParams>,
) {
  const pagination = ref<Pagination>({
    page: options.initialPagination?.page ?? DEFAULT_PAGE,
    pageSize: options.initialPagination?.pageSize ?? DEFAULT_PAGE_SIZE,
    search: options.initialPagination?.search,
  })

  const extraParams = ref<TExtraParams>(options.initialExtraParams ?? ({} as TExtraParams))

  const items = ref<T[]>([])
  const meta = ref<PaginatedMeta | null>(null)
  const loading = ref(false)
  const requestError = ref<string | null>(null)

  /** Volta à primeira página quando filtros externos mudam. */
  function goToFirstPage() {
    pagination.value = { ...pagination.value, page: DEFAULT_PAGE }
  }

  async function execute() {
    loading.value = true
    requestError.value = null
    try {
      const result = await options.request(pagination.value, extraParams.value)
      items.value = result.items
      meta.value = result.meta
    } catch (e: unknown) {
      items.value = []
      meta.value = null
      const msg = getFetchErrorMessage(e)
      requestError.value = msg
      options.onRequestError?.(msg)
    } finally {
      loading.value = false
    }
  }

  let searchInput: Ref<string> | undefined
  if (options.debounceSearchMs != null) {
    searchInput = ref(options.initialPagination?.search ?? '')
    const searchDebounced = useDebounce(searchInput, options.debounceSearchMs)
    watch(searchDebounced, (value) => {
      pagination.value = { ...pagination.value, search: value.trim(), page: DEFAULT_PAGE }
    })
  }

  if (options.autoExecute) {
    watch(pagination, () => void execute(), { deep: true, immediate: true })
  }

  const paginationParams = computed(() => ({
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    search: pagination.value.search,
  }))

  const shouldShowPagination = computed(() => meta.value != null && meta.value.total > 0 && meta.value.pageCount > 1)

  const upaginationProps = computed(() => {
    const m = meta.value
    return {
      total: m?.total ?? 0,
      itemsPerPage: m?.pageSize ?? pagination.value.pageSize,
      showEdges: true,
      siblingCount: 1,
      color: 'neutral' as const,
      variant: 'outline' as const,
    }
  })

  const pageRangeLabel = computed(() => {
    const m = meta.value
    if (!m) return null
    return { current: m.page, pageCount: m.pageCount }
  })

  const totalCount = computed(() => meta.value?.total ?? null)

  return {
    pagination,
    extraParams,
    items,
    meta,
    loading,
    requestError,
    execute,
    goToFirstPage,
    searchInput,
    maxPageSizeLimit: MAX_PAGE_SIZE,
    paginationParams,
    shouldShowPagination,
    upaginationProps,
    pageRangeLabel,
    totalCount,
  }
}
