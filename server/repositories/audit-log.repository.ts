import type { Prisma } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

export type AuditLogFilters = {
  actorId?: number
  action?: string
  entity?: string
  from?: Date
  to?: Date
}

const auditLogSelect = {
  id: true,
  actorId: true,
  action: true,
  entity: true,
  entityId: true,
  metadata: true,
  createdAt: true,
  actor: {
    select: { id: true, email: true, name: true },
  },
} satisfies Prisma.AuditLogSelect

export type AuditLogRow = Prisma.AuditLogGetPayload<{ select: typeof auditLogSelect }>

function buildWhere(filters: AuditLogFilters): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {}
  if (filters.actorId !== undefined) where.actorId = filters.actorId
  if (filters.action) where.action = { contains: filters.action, mode: 'insensitive' }
  if (filters.entity) where.entity = { contains: filters.entity, mode: 'insensitive' }
  if (filters.from || filters.to) {
    where.createdAt = {}
    if (filters.from) where.createdAt.gte = filters.from
    if (filters.to) where.createdAt.lte = filters.to
  }
  return where
}

export const auditLogRepository = {
  async listPaginated(params: { filters: AuditLogFilters; skip: number; take: number }) {
    const where = buildWhere(params.filters)
    const [total, rows] = await prisma.$transaction([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
        select: auditLogSelect,
      }),
    ])
    return { total, rows }
  },
}
