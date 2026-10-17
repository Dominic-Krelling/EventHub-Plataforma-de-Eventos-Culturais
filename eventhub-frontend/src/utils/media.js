const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '')

function normalizeImagePath(image) {
  return String(image).replace(/^\/+/, '')
}

export function getEventImageUrl(image) {
  if (!image) return ''

  if (/^https?:\/\//i.test(image)) {
    return image
  }

  const normalized = normalizeImagePath(image)

  if (normalized.startsWith('uploads/')) {
    return `${SERVER_BASE}/${normalized}`
  }

  return `${SERVER_BASE}/uploads/events/${normalized}`
}

export function getProfileImageUrl(image) {
  if (!image) {
    image = 'default-profile.png'
  }

  if (/^https?:\/\//i.test(image)) {
    return image
  }

  const normalized = normalizeImagePath(image)

  if (normalized.startsWith('uploads/')) {
    return `${SERVER_BASE}/${normalized}`
  }

  return `${SERVER_BASE}/uploads/profiles/${normalized}`
}