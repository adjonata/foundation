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

  function verifyEmail(body: { token: string }): Promise<AuthUser> {
    return execute(() => $fetch<AuthUser>('/api/auth/verify-email', withDefaults({ method: 'post', body })), {
      retryOn401: false,
    })
  }

  function resendVerification(): Promise<{ sent: boolean }> {
    return execute(() => $fetch<{ sent: boolean }>('/api/auth/resend-verification', withDefaults({ method: 'post' })))
  }

  function forgotPassword(body: { email: string }): Promise<{ message: string }> {
    return execute(
      () => $fetch<{ message: string }>('/api/auth/forgot-password', withDefaults({ method: 'post', body })),
      { retryOn401: false },
    )
  }

  function resetPassword(body: { token: string; password: string }): Promise<{ message: string }> {
    return execute(
      () => $fetch<{ message: string }>('/api/auth/reset-password', withDefaults({ method: 'post', body })),
      { retryOn401: false },
    )
  }

  return {
    me,
    login,
    register,
    logout,
    refresh,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  }
}
