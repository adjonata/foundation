import type { Prisma } from '../../prisma/generated/client'
import { Role } from '../../prisma/generated/client'
import { prisma } from '../utils/db'

type CreateUserInput = {
  name: string
  email: string
  passwordHash: string
  role?: Role
}

const adminListSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

export type AdminListedUserRow = Prisma.UserGetPayload<{ select: typeof adminListSelect }>

function buildUserSearchWhere(search: string | undefined): Prisma.UserWhereInput {
  if (!search) return {}
  return {
    OR: [{ email: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }],
  }
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

  /**
   * Listagem para o painel admin: total + pagina, com busca opcional em email/nome.
   */
  async listPaginatedForAdmin(params: { search?: string; skip: number; take: number }) {
    const where = buildUserSearchWhere(params.search)

    const [total, rows] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: params.skip,
        take: params.take,
        select: adminListSelect,
      }),
    ])

    return { total, rows }
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
