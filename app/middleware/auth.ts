export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth state to be loaded
  if (isLoading.value) {
    return
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/')
  }
})
