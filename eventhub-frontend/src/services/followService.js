import api from './api'
import { PAGE_SIZE } from '../config/constants'

export function toggleFollow(userId) {
  return api.post(`/users/${userId}/toggle-follow`)
}

export function getFollowers(userId) {
  return api.get(`/users/${userId}/followers`)
}

export function getFollowing(userId) {
  return api.get(`/users/${userId}/following`)
}


export function getFollowingEvents(page = 1, limit = PAGE_SIZE) {
    return api.get('/following-events', {
    params: { page, limit }
  })
}