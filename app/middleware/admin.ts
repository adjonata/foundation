import { isAdminPanelRole } from '#shared/constants/rbac'

/** Exige autenticação (middleware `auth` antes) e papel com acesso ao painel (API em `/api/protected/admin/*`). */
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) return

  if (isAdminPanelRole(authStore.role)) return

  return navigateTo('/')
})
