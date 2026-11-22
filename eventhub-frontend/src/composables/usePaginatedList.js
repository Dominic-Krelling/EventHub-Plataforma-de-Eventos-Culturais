import { ref, watch as vueWatch } from 'vue'
import { MESSAGES, PAGE_SIZE } from '../config/constants'

export function usePaginatedList(
  fetchPage,
  { pageSize = PAGE_SIZE, immediate = true, watch: source = null } = {}
) {
  const items = ref([])
  const page = ref(1)
  const hasMore = ref(false)
  const isLoading = ref(immediate)
  const error = ref('')

  let lastCallId = 0

  async function load() {
    const callId = ++lastCallId

    isLoading.value = true
    error.value = ''

    try {
      const result = await fetchPage(page.value, pageSize)
      if (callId !== lastCallId) return

      const list = Array.isArray(result) ? result : result?.items ?? []

      const knownIds = new Set(items.value.map((item) => item.id))
      items.value.push(...list.filter((item) => !knownIds.has(item.id)))

      hasMore.value = result?.pagination
        ? Boolean(result.pagination.hasMore)
        : list.length === pageSize

      page.value += 1
    } catch (err) {
      if (callId !== lastCallId) return
      error.value = err?.message || MESSAGES.LOAD_ERROR
    } finally {
      if (callId === lastCallId) isLoading.value = false
    }
  }

  function loadMore() {
    if (isLoading.value) return undefined
    return load()
  }

  function reload() {
    page.value = 1
    items.value = []
    hasMore.value = false
    return load()
  }

  if (immediate) load()

  if (source) vueWatch(source, () => reload())

  return { items, hasMore, isLoading, error, loadMore, reload }
}
