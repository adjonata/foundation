import { Role, type PrismaClient } from '../generated/client'
import { PERMISSION_DEFINITIONS, ROLE_PERMISSIONS } from '../../server/utils/permissions'

export async function seedPermissions(prisma: PrismaClient) {
  for (const permission of PERMISSION_DEFINITIONS) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: {
        name: permission.name,
        description: permission.description,
      },
    })
  }

  await prisma.rolePermission.deleteMany()

  for (const role of Object.values(Role)) {
    const permissionNames = ROLE_PERMISSIONS[role]

    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
        select: { id: true },
      })

      if (!permission) continue

      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          role,
          permissionId: permission.id,
        },
      })
    }
  }
}
