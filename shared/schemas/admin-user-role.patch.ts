import { z } from 'zod'

/** Valores do enum `Role` no Prisma (evitar import de Prisma em `shared/`). */
const roleValues = ['SUPER_ADMIN', 'ADMIN', 'USER'] as const

/** Body de `PATCH /api/protected/admin/users/:id/role`. */
export const adminUserRoleUpdateBodySchema = z.object({
  role: z.enum(roleValues),
})

export type AdminUserRoleUpdateBody = z.infer<typeof adminUserRoleUpdateBodySchema>

/** `id` de rota numérico positivo. */
export const adminUserIdParamSchema = z.coerce.number().int().positive()
