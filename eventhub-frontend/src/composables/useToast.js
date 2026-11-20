import { readonly, ref } from 'vue'
import { TOAST_DURATION } from '../config/constants'

const toasts = ref([])
let nextId = 1

function remove(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function show(message, type = 'info', duration) {
  const id = nextId++
  const ms = duration ?? TOAST_DURATION[type.toUpperCase()] ?? TOAST_DURATION.INFO

  toasts.value.push({ id, message, type })
  setTimeout(() => remove(id), ms)

  return id
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    remove,
    success: (message, duration) => show(message, 'success', duration),
    error: (message, duration) => show(message, 'error', duration),
    info: (message, duration) => show(message, 'info', duration)
  }
}