import { Role } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

type CreateUserInput = {
  name: string
  email: string
  passwordHash: string
  role?: Role
}

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } })
  },

  listAll() {
    return prisma.user.findMany({
      orderBy: { id: 'asc' },
    })
  },

  create(input: CreateUserInput) {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role ?? Role.USER,
      },
    })
  },
}
