/** Valores do enum `Role` no Prisma (alinhados ao schema e PATCH admin). */
export const prismaRoleSlugs = ['SUPER_ADMIN', 'ADMIN', 'USER'] as const

export type PrismaRoleSlug = (typeof prismaRoleSlugs)[number]
