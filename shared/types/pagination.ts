/**
 * Metadados de listagens paginadas expostas pela API.
 * `page` e `pageSize` reflectem os valores validados (apos defaults).
 */
export type PaginatedMeta = {
  page: number
  pageSize: number
  /** Total de registos que cumprem o filtro (independente da pagina). */
  total: number
  /** Numero de paginas; 0 se `total` for 0. */
  pageCount: number
}

/** Envelope generico para respostas paginadas. */
export type PaginatedResult<T> = {
  items: T[]
  meta: PaginatedMeta
}
