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
  emailVerifiedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

export type AdminListedUserRow = Prisma.UserGetPayload<{ select: typeof adminListSelect }>

function buildUserSearchWhere(search: string | undefined, showDeleted: boolean): Prisma.UserWhereInput {
  const deletedFilter: Prisma.UserWhereInput = showDeleted ? {} : { deletedAt: null }
  if (!search) return deletedFilter
  return {
    ...deletedFilter,
    OR: [{ email: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }],
  }
}

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email } })
  },

  findById(id: number) {
    return prisma.user.findFirst({ where: { id, deletedAt: null } })
  },

  listAll() {
    return prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: adminListSelect,
    })
  },

  /**
   * Listagem para o painel admin: total + pagina, com busca opcional em email/nome.
   */
  async listPaginatedForAdmin(params: { search?: string; skip: number; take: number; showDeleted?: boolean }) {
    const where = buildUserSearchWhere(params.search, params.showDeleted ?? false)

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

  /**
   * Atualiza o papel de um utilizador no painel admin.
   * Impede retirar o último `SUPER_ADMIN` do sistema.
   */
  async assignRoleById(
    userId: number,
    newRole: Role,
  ): Promise<
    | { success: true; row: AdminListedUserRow; previousRole: Role }
    | { success: false; code: 'NOT_FOUND' }
    | { success: false; code: 'LAST_SUPER_ADMIN' }
  > {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      })
      if (!user) {
        return { success: false as const, code: 'NOT_FOUND' as const }
      }

      if (user.role === newRole) {
        const row = await tx.user.findUnique({
          where: { id: userId },
          select: adminListSelect,
        })
        return { success: true as const, row: row!, previousRole: user.role }
      }

      if (user.role === Role.SUPER_ADMIN && newRole !== Role.SUPER_ADMIN) {
        const superAdminCount = await tx.user.count({ where: { role: Role.SUPER_ADMIN, deletedAt: null } })
        if (superAdminCount <= 1) {
          return { success: false as const, code: 'LAST_SUPER_ADMIN' as const }
        }
      }

      const row = await tx.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: adminListSelect,
      })
      return { success: true as const, row, previousRole: user.role }
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

  deleteById(id: number) {
    return prisma.user.delete({ where: { id } })
  },

  markEmailVerified(id: number) {
    return prisma.user.update({
      where: { id },
      data: { emailVerifiedAt: new Date() },
    })
  },

  updatePassword(id: number, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    })
  },

  async restoreById(
    userId: number,
  ): Promise<{ success: true; row: AdminListedUserRow } | { success: false; code: 'NOT_FOUND' | 'ALREADY_ACTIVE' }> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, deletedAt: true },
      })
      if (!user) return { success: false as const, code: 'NOT_FOUND' as const }
      if (!user.deletedAt) return { success: false as const, code: 'ALREADY_ACTIVE' as const }
      const row = await tx.user.update({
        where: { id: userId },
        data: { deletedAt: null },
        select: adminListSelect,
      })
      return { success: true as const, row }
    })
  },

  async softDeleteById(
    userId: number,
  ): Promise<
    | { success: true; row: AdminListedUserRow }
    | { success: false; code: 'NOT_FOUND' | 'ALREADY_DELETED' | 'LAST_SUPER_ADMIN' }
  > {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, deletedAt: true },
      })
      if (!user) return { success: false as const, code: 'NOT_FOUND' as const }
      if (user.deletedAt) return { success: false as const, code: 'ALREADY_DELETED' as const }
      if (user.role === Role.SUPER_ADMIN) {
        const count = await tx.user.count({ where: { role: Role.SUPER_ADMIN, deletedAt: null } })
        if (count <= 1) return { success: false as const, code: 'LAST_SUPER_ADMIN' as const }
      }
      const row = await tx.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
        select: adminListSelect,
      })
      await tx.authSession.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      return { success: true as const, row }
    })
  },
}
