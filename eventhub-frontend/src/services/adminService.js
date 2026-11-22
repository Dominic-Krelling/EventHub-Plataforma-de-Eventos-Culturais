import api from './api'

export function getAdminDashboard() {
  return api.get('/admin/dashboard')
}

export function getAdminReports(status, page, limit) {
  return api.get('/admin/reports', { params: { status, page, limit } })
}

export function reviewAdminReport(id) {
  return api.patch(`/admin/reports/${id}/review`)
}

export function getAdminUsers(search, page, limit) {
  return api.get('/admin/users', { params: { search: search || undefined, page, limit } })
}

export function setUserBlocked(id, isBlocked) {
  return api.patch(`/admin/users/${id}/block`, { isBlocked })
}

export function getAdminEvents(search, page, limit) {
  return api.get('/admin/events', { params: { search: search || undefined, page, limit } })
}

export function deleteAdminEvent(id) {
  return api.delete(`/admin/events/${id}`)
}