import type { AdminPermission, AdminRoleWithPermissions } from '#shared/types/admin'
import { useApiBase } from '../base'

/** Chamadas à API administrativa (requer sessão + papel com permissão). */
export function useAdminApi() {
  const { withDefaults, execute } = useApiBase()

  function listPermissions(): Promise<AdminPermission[]> {
    return execute(() => $fetch<AdminPermission[]>('/api/admin/permissions', withDefaults({ method: 'get' })))
  }

  function listRolesWithPermissions(): Promise<AdminRoleWithPermissions[]> {
    return execute(() => $fetch<AdminRoleWithPermissions[]>('/api/admin/roles', withDefaults({ method: 'get' })))
  }

  return {
    listPermissions,
    listRolesWithPermissions
  }
}
