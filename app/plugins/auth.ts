export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser } = useAuth()

  // On server: use the request event to pass cookies
  if (import.meta.server) {
    const event = nuxtApp.ssrContext?.event
    if (event) {
      try {
        const { user } = await $fetch<{ user: any }>('/api/auth/me', {
          headers: {
            cookie: event.node.req.headers.cookie || ''
          }
        })
        if (user) {
          const authState = useState<any>('auth', () => ({ user: null, isLoading: true }))
          authState.value = { user, isLoading: false }
        }
      } catch {
        // Ignore errors on server
      }
    }
  }

  // On client: fetch user (will use hydrated state if available)
  if (import.meta.client) {
    await fetchUser()
  }
})
