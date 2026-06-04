import type {
  AdminPermission,
  AdminRoleWithPermissions,
  AdminSessionListItem,
  AdminSessionsListResponse,
  AdminUserListItem,
  AdminUsersListResponse,
} from '#shared/types/admin'
import type { AdminUserRoleUpdateBody } from '#shared/schemas/admin-user-role.patch'
import type { AdminSessionsQuery } from '#shared/schemas/admin-sessions.query'
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
    query?: Partial<Pick<AdminUsersQuery, 'page' | 'pageSize' | 'search' | 'showDeleted'>>,
  ): Promise<AdminUsersListResponse> {
    return execute(() =>
      $fetch<AdminUsersListResponse>('/api/protected/admin/users', withDefaults({ method: 'get', query })),
    )
  }

  function deleteUser(userId: number): Promise<AdminUserListItem> {
    return execute(() =>
      $fetch<AdminUserListItem>(`/api/protected/admin/users/${userId}`, withDefaults({ method: 'delete' })),
    )
  }

  function restoreUser(userId: number): Promise<AdminUserListItem> {
    return execute(() =>
      $fetch<AdminUserListItem>(`/api/protected/admin/users/${userId}/restore`, withDefaults({ method: 'patch' })),
    )
  }

  function updateUserRole(userId: number, body: AdminUserRoleUpdateBody): Promise<AdminUserListItem> {
    return execute(() =>
      $fetch<AdminUserListItem>(`/api/protected/admin/users/${userId}/role`, withDefaults({ method: 'patch', body })),
    )
  }

  function listSessions(
    query?: Partial<Pick<AdminSessionsQuery, 'page' | 'pageSize'>>,
  ): Promise<AdminSessionsListResponse> {
    return execute(() =>
      $fetch<AdminSessionsListResponse>('/api/protected/admin/sessions', withDefaults({ method: 'get', query })),
    )
  }

  function revokeSession(sessionId: number): Promise<void> {
    return execute(() => $fetch<void>(`/api/protected/admin/sessions/${sessionId}`, withDefaults({ method: 'delete' })))
  }

  function resendVerificationForUser(userId: number): Promise<{ sent: boolean }> {
    return execute(() =>
      $fetch<{ sent: boolean }>(
        `/api/protected/admin/users/${userId}/resend-verification`,
        withDefaults({ method: 'post' }),
      ),
    )
  }

  return {
    listPermissions,
    listRolesWithPermissions,
    listUsers,
    updateUserRole,
    deleteUser,
    restoreUser,
    listSessions,
    revokeSession,
    resendVerificationForUser,
  }
}
