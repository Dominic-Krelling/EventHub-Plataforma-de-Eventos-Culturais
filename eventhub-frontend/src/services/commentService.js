import api from './api'

export function getComments(eventId) {
  return api.get(`/events/${eventId}/comments`)
}

export function createComment(eventId, content) {
  return api.post(`/events/${eventId}/comments`, { content })
}