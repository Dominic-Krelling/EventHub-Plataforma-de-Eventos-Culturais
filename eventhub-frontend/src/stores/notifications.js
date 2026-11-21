import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUnreadCount } from '../services/notificationService'
import { NOTIFICATIONS } from '../config/constants'

export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0)

  let lastRefreshId = 0
  let timerId = null

  async function refresh() {
    const refreshId = ++lastRefreshId

    try {
      const response = await getUnreadCount()

      if (refreshId !== lastRefreshId) return

      unreadCount.value = response.data.unreadCount
    } catch (error) {
      if (error?.status === 401) stopPolling()
    }
  }

  function setUnreadCount(value) {
    lastRefreshId++
    unreadCount.value = Math.max(0, value)
  }

  function refreshIfVisible() {
    if (document.visibilityState === 'visible') refresh()
  }

  function startPolling() {
    if (timerId !== null) return

    refresh()
    timerId = setInterval(refreshIfVisible, NOTIFICATIONS.POLL_MS)
    document.addEventListener('visibilitychange', refreshIfVisible)
  }

  function stopPolling() {
    clearInterval(timerId)
    timerId = null
    document.removeEventListener('visibilitychange', refreshIfVisible) // MESMA referência

    lastRefreshId++
    unreadCount.value = 0
  }

  return { unreadCount, refresh, setUnreadCount, startPolling, stopPolling }
})