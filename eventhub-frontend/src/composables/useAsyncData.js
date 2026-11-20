import { ref, watch as vueWatch } from 'vue'
import { MESSAGES } from '../config/constants'

export function useAsyncData(fetcher, { watch, immediate = true, initialData = null } = {}) {
  const makeInitial = typeof initialData === 'function' ? initialData : () => initialData

  const data = ref(makeInitial())
  const error = ref('')
  const isLoading = ref(immediate)

  let lastCallId = 0

  async function execute() {
    const callId = ++lastCallId

    isLoading.value = true
    error.value = ''
    data.value = makeInitial()

    try {
      const result = await fetcher()
      if (callId !== lastCallId) return // resposta velha: ignora
      data.value = result
    } catch (err) {
      if (callId !== lastCallId) return
      error.value = err?.message || MESSAGES.LOAD_ERROR
    } finally {
      if (callId === lastCallId) isLoading.value = false
    }
  }

  if (watch) vueWatch(watch, () => execute())
  if (immediate) execute()

  return { data, error, isLoading, execute }
}