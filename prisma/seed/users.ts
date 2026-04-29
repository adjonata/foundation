import argon2 from 'argon2'
import { Role, type PrismaClient } from '../generated/client'

async function makePasswordHash() {
  return argon2.hash('123456')
}

export async function seedUsers(prisma: PrismaClient, organizationId: number) {
  const passwordHash = await makePasswordHash()

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@orderflow.dev' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@orderflow.dev',
      passwordHash,
      role: Role.SUPER_ADMIN
    }
  })

  const orgAdmin = await prisma.user.upsert({
    where: { email: 'admin@acme-store.dev' },
    update: {},
    create: {
      name: 'Org Admin',
      email: 'admin@acme-store.dev',
      passwordHash,
      role: Role.ORG_ADMIN,
      organizationId
    }
  })

  const customer = await prisma.user.upsert({
    where: { email: 'customer@acme-store.dev' },
    update: {},
    create: {
      name: 'Customer',
      email: 'customer@acme-store.dev',
      passwordHash,
      role: Role.CUSTOMER,
      organizationId
    }
  })

  return { superAdmin, orgAdmin, customer }
}
