import 'dotenv/config'
import { prisma } from './client'
import { seedUsers } from './users'

async function main() {
  const { superAdmin, user } = await seedUsers(prisma)

  console.log('Seed concluido com sucesso')
  console.log({
    superAdmin: superAdmin.email,
    user: user.email,
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
