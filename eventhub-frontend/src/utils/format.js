export function formatDateTime(value) {
  if (!value) return ''

  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatCount(value) {
  return Number(value ?? 0).toLocaleString('pt-BR')
}