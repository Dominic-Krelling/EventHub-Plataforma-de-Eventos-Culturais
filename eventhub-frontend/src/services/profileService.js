import api from './api'

export function getMyProfile() {
  return api.get('/profile/me')
}

export function updateProfile(formData) {
  return api.put('/profile/me', formData, { silent: true })
}

export function getPublicProfile(username) {
  return api.get(`/profile/${username}`)
}