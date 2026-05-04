import type { PaginatedMeta, PaginatedResult } from '#shared/types/pagination'

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

/** Numero de paginas para um total e tamanho de pagina. */
export function computePageCount(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) return 0
  return Math.ceil(total / pageSize)
}

/** Constroi `meta` para uma listagem paginada. */
export function buildPaginatedMeta(total: number, page: number, pageSize: number): PaginatedMeta {
  return {
    page,
    pageSize,
    total,
    pageCount: computePageCount(total, pageSize)
  }
}

/** Monta o envelope `PaginatedResult` a partir dos items ja cortados e totais. */
export function buildPaginatedResult<T>(items: T[], total: number, page: number, pageSize: number): PaginatedResult<T> {
  return {
    items,
    meta: buildPaginatedMeta(total, page, pageSize)
  }
}

/** `skip` do Prisma a partir de pagina base 1. */
export function computeSkip(page: number, pageSize: number): number {
  return (Math.max(1, page) - 1) * pageSize
}
