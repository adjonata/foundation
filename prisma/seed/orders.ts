import type { PrismaClient } from '../generated/client'

export async function seedSampleOrder(
  prisma: PrismaClient,
  organizationId: number,
  customerId: number
) {
  return prisma.order.create({
    data: {
      organizationId,
      customerId
    }
  })
}
