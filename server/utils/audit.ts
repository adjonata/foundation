import type { Prisma } from '../../prisma/generated/client'
import type { AuditEventKey } from './auditEvents'
import { AuditEvent } from './auditEvents'
import { prisma } from './db'

interface AuditParams {
  event: AuditEventKey
  actorId: number | null
  entityId?: string
  metadata?: Prisma.InputJsonObject
}

export async function audit(params: AuditParams): Promise<void> {
  const { action, entity } = AuditEvent[params.event]
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action,
        entity,
        entityId: params.entityId ?? null,
        metadata: params.metadata ?? {},
      },
    })
  } catch (err) {
    console.error('[audit] Falha ao registar evento de auditoria:', params.event, err)
  }
}
