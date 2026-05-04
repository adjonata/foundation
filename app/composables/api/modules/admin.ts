import type { AdminPermission, AdminRoleWithPermissions, AdminUsersListResponse } from '#shared/types/admin'
import type { AdminUsersQuery } from '#shared/schemas/admin-users.query'
import { useApiBase } from '../base'

/** Chamadas à API administrativa (requer sessão + papel com permissão). */
export function useAdminApi() {
  const { withDefaults, execute } = useApiBase()

  function listPermissions(): Promise<AdminPermission[]> {
    return execute(() => $fetch<AdminPermission[]>('/api/protected/admin/permissions', withDefaults({ method: 'get' })))
  }

  function listRolesWithPermissions(): Promise<AdminRoleWithPermissions[]> {
    return execute(() =>
      $fetch<AdminRoleWithPermissions[]>('/api/protected/admin/roles', withDefaults({ method: 'get' })),
    )
  }

  function listUsers(
    query?: Partial<Pick<AdminUsersQuery, 'page' | 'pageSize' | 'search'>>,
  ): Promise<AdminUsersListResponse> {
    return execute(() =>
      $fetch<AdminUsersListResponse>('/api/protected/admin/users', withDefaults({ method: 'get', query })),
    )
  }

  return {
    listPermissions,
    listRolesWithPermissions,
    listUsers,
  }
}
