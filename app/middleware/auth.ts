export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  await authStore.ensureSession()

  if (authStore.isAuthenticated) return

  // Permite apenas redirecionamento interno para evitar open redirect
  const redirect = to.fullPath.startsWith('/') && !to.fullPath.startsWith('//') ? to.fullPath : '/'

  return navigateTo({
    path: '/entrar',
    query: { redirect },
  })
})
