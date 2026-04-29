import 'dotenv/config'
import { prisma } from './client'
import { seedOrganization } from './organizations'
import { seedUsers } from './users'
import { seedSampleOrder } from './orders'

async function main() {
  const organization = await seedOrganization(prisma)
  const { superAdmin, orgAdmin, customer } = await seedUsers(
    prisma,
    organization.id
  )
  const order = await seedSampleOrder(prisma, organization.id, customer.id)

  console.log('Seed concluido com sucesso')
  console.log({
    organization: organization.slug,
    superAdmin: superAdmin.email,
    orgAdmin: orgAdmin.email,
    customer: customer.email,
    sampleOrderId: order.id
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
