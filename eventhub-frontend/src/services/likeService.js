import api from './api'

export function toggleLike(eventId) {
  return api.post(`/events/${eventId}/toggle-like`)
}

export function getLikeStatus(eventId) {
  return api.get(`/events/${eventId}/like-status`)
}

export function getLikedEvents() {
  return api.get('/liked-events')
}