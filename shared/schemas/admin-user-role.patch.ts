import { z } from 'zod'
import { prismaRoleSlugs } from '#shared/constants/prisma-roles'

/** Body de `PATCH /api/protected/admin/users/:id/role`. */
export const adminUserRoleUpdateBodySchema = z.object({
  role: z.enum(prismaRoleSlugs),
})

export type AdminUserRoleUpdateBody = z.infer<typeof adminUserRoleUpdateBodySchema>

/** `id` de rota numérico positivo. */
export const adminUserIdParamSchema = z.coerce.number().int().positive()
