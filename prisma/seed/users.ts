import argon2 from 'argon2'
import { Role, type PrismaClient } from '../generated/client'

async function makePasswordHash() {
  return argon2.hash('123456')
}

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await makePasswordHash()

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@starter.dev' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@starter.dev',
      passwordHash,
      role: Role.SUPER_ADMIN
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@starter.dev' },
    update: {},
    create: {
      name: 'Usuário',
      email: 'user@starter.dev',
      passwordHash,
      role: Role.USER
    }
  })

  return { superAdmin, user }
}
