import { onUnmounted, ref, toValue, watch } from 'vue'

export function useDebouncedValue(source, delay = 400) {
  const debounced = ref(toValue(source)) 
  let timer = null

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onUnmounted(() => clearTimeout(timer))

  return debounced
}