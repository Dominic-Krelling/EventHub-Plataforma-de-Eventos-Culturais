import api from './api'
import { PAGE_SIZE } from '../config/constants'

export function createEvent(formData, onProgress) {
  return api.post('/events', formData, {
    onUploadProgress: onProgress,
    silent: true
  })
}

export function getEvents() {
  return api.get('/events')
}

export function getMyEvents() {
  return api.get('/events/mine')
}

export function getEventById(id) {
  return api.get(`/events/${id}`)
}

export function getEventForEdit(id) {
  return api.get(`/events/${id}/edit`)
}

export function getFeed(page = 1, limit = PAGE_SIZE) {
  return api.get('/feed', {
    params: { page, limit }
  })
}

export function updateEvent(id, formData, onProgress) {
  return api.put(`/events/${id}`, formData, {
    onUploadProgress: onProgress,
    silent: true
  })
}

export function deleteEvent(id) {
  return api.delete(`/events/${id}`)
}