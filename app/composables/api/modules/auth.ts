import { useApiBase } from '../base'
import type { AuthUser } from '#shared/types/user'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

/** Encapsula as chamadas da secao de autenticacao. */
export function useAuthApi() {
  const { withDefaults, execute } = useApiBase()

  function me(): Promise<AuthUser> {
    return execute(() => $fetch<AuthUser>('/api/auth/me', withDefaults({ method: 'get' })))
  }

  function login(body: LoginPayload): Promise<AuthUser> {
    return execute(() => $fetch<AuthUser>('/api/auth/login', withDefaults({ method: 'post', body })), {
      retryOn401: false,
    })
  }

  function register(body: RegisterPayload): Promise<AuthUser> {
    return execute(() => $fetch<AuthUser>('/api/auth/register', withDefaults({ method: 'post', body })))
  }

  function logout(): Promise<void> {
    return execute(() => $fetch<void>('/api/auth/logout', withDefaults({ method: 'post' })))
  }

  function refresh(): Promise<AuthUser> {
    return execute(() => $fetch<AuthUser>('/api/auth/refresh', withDefaults({ method: 'post' })))
  }

  return {
    me,
    login,
    register,
    logout,
    refresh,
  }
}
