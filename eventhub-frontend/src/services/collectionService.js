import api from './api'

export function createCollection(data) {
  return api.post('/collections', data, { silent: true })
}

export function getMyCollections() {
  return api.get('/my-collections')
}

export function getCollectionById(id) {
  return api.get(`/collections/${id}`)
}

export function deleteCollection(id) {
  return api.delete(`/collections/${id}`)
}

export function addEventToCollection(collectionId, eventId) {
  return api.post(`/collections/${collectionId}/events`, { eventId })
}

export function removeEventFromCollection(collectionId, eventId) {
  return api.delete(`/collections/${collectionId}/events/${eventId}`)
}

export function getCollectionsStatus(eventId) {
  return api.get(`/events/${eventId}/collections-status`)
}