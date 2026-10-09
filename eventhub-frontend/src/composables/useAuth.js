import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)
  const isAuthenticated = computed(
    () => authStore.isAuthenticated
  )

  const isAdmin = computed(
    () => Boolean(authStore.user?.isAdmin)
  )

  async function login(credentials) {
    return authStore.login(credentials)
  }

  function logout() {
    authStore.logout()
  }

  function setUser(userData) {
    authStore.setUser(userData)
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    setUser
  }
}