import { useApiBase } from '../base'
import type { AuthUser } from '#shared/types/user'
import type { UserSession } from '#shared/types/session'

export function useUserApi() {
  const { withDefaults, execute } = useApiBase()

  function getMe(): Promise<AuthUser> {
    return execute(() => $fetch<AuthUser>('/api/protected/users/me', withDefaults()))
  }

  function updateProfile(data: { name: string; email: string }): Promise<AuthUser> {
    return execute(() =>
      $fetch<AuthUser>('/api/protected/users/me', withDefaults({ method: 'patch', body: data })),
    )
  }

  function updateAvatar(file: File): Promise<AuthUser> {
    const formData = new FormData()
    formData.append('file', file)
    return execute(() =>
      $fetch<AuthUser>('/api/protected/users/me/avatar', withDefaults({ method: 'patch', body: formData })),
    )
  }

  function changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    return execute(() =>
      $fetch<void>('/api/protected/users/me/password', withDefaults({ method: 'patch', body: data })),
    )
  }

  function getSessions(): Promise<UserSession[]> {
    return execute(() => $fetch<UserSession[]>('/api/protected/users/me/sessions', withDefaults()))
  }

  function revokeSession({ sessionId }: { sessionId: number }): Promise<void> {
    return execute(() =>
      $fetch<void>(`/api/protected/users/me/sessions/${sessionId}`, withDefaults({ method: 'delete' })),
    )
  }

  return { getMe, updateProfile, updateAvatar, changePassword, getSessions, revokeSession }
}
