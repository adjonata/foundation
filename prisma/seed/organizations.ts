import type { PrismaClient } from '../generated/client'

export async function seedOrganization(prisma: PrismaClient) {
  return prisma.organization.upsert({
    where: { slug: 'acme-store' },
    update: {},
    create: {
      name: 'Acme Store',
      slug: 'acme-store'
    }
  })
}
