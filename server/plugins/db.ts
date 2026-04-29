import { prisma } from '../utils/db'

export default defineNitroPlugin(() => {
  // Garante inicializacao unica do Prisma no runtime Nitro.
  return prisma
})
