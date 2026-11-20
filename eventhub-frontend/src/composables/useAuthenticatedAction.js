import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function useAuthenticatedAction() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const isBusy = ref(false)

  async function run(action) {
    if (!authStore.isAuthenticated) {
      router.push({ path: '/login', query: { redirect: route.fullPath } })
      return undefined
    }

    if (isBusy.value) return undefined

    isBusy.value = true

    try {
      return await action()
    } finally {
      isBusy.value = false
    }
  }

  return { run, isBusy }
}