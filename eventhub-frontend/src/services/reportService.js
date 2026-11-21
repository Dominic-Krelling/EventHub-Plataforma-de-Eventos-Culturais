import api from './api'

export function reportEvent(eventId, reason) {
  return api.post(`/events/${eventId}/report`, { reason }, { silent: true })
}