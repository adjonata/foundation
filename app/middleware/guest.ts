export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  await authStore.ensureSession()

  if (!authStore.isAuthenticated) return

  return navigateTo('/')
})
