import type { User } from '~/types/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
}

export function useAuth() {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    isLoading: true
  }))

  const isAuthenticated = computed(() => !!authState.value.user)

  async function fetchUser() {
    authState.value.isLoading = true
    try {
      const { user } = await $fetch<{ user: User | null }>('/api/auth/me')
      authState.value.user = user
    } catch (error) {
      console.error('Failed to fetch user:', error)
      authState.value.user = null
    } finally {
      authState.value.isLoading = false
    }
  }

  function login() {
    window.location.href = '/api/auth/login'
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      authState.value.user = null
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    user: computed(() => authState.value.user),
    isAuthenticated,
    isLoading: computed(() => authState.value.isLoading),
    fetchUser,
    login,
    logout
  }
}
