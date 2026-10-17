import api from './api'

export function createEvent(formData, onProgress) {
  return api.post('/events', formData, {
    onUploadProgress: onProgress
  })
}

export function getEvents() {
  return api.get('/events')
}

export function getEventById(id) {
  return api.get(`/events/${id}`)
}

export function getFeed(page = 1, limit = 6) {
  return api.get('/feed', {
    params: { page, limit }
  })
}

export function updateEvent(id, formData, onProgress) {
  return api.put(`/events/${id}`, formData, {
    onUploadProgress: onProgress
  })
}

export function deleteEvent(id) {
  return api.delete(`/events/${id}`)
}