import { isAdminPanelRole } from '#shared/constants/rbac'

/** Exige autenticação (`auth` antes) e papel SUPER_ADMIN para alinhar com `/api/protected/admin/*`. */
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) return

  if (isAdminPanelRole(authStore.role)) return

  return navigateTo('/')
})
