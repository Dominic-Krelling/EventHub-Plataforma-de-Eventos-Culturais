const adminService = require('./adminService')
const eventService = require('../event/eventService')
const { parsePagination } = require('../../utils/pagination')
const { parseId } = require('../../utils/parseId')
const { success } = require('../../middlewares/apiResponse')
const { SEARCH, REPORT } = require('../../config/constants')

function readSearch(req) {
  const raw = typeof req.query.search === 'string' ? req.query.search : ''
  return raw.trim().slice(0, SEARCH.MAX_LENGTH)
}

async function dashboard(req, res) {
  const data = await adminService.getDashboardStats()
  return success(res, data, 'Estatísticas carregadas.')
}

async function listReports(req, res) {
  const { page, limit } = parsePagination(req.query)
  const status = req.query.status || REPORT.STATUS.PENDING

  const data = await adminService.getReports(status, page, limit)
  return success(res, data, 'Denúncias listadas com sucesso.')
}

async function reviewReport(req, res) {
  const id = parseId(req.params.id, 'denúncia')
  const data = await adminService.reviewReport(id)
  return success(res, data, 'Denúncia marcada como revisada.')
}

async function listUsers(req, res) {
  const { page, limit } = parsePagination(req.query)
  const data = await adminService.getUsers(readSearch(req), page, limit)
  return success(res, data, 'Usuários listados com sucesso.')
}

async function blockUser(req, res) {
  const targetId = parseId(req.params.id, 'usuário')
  const { isBlocked } = req.body

  const data = await adminService.setUserBlocked(targetId, isBlocked, req.user.id)

  return success(res, data, isBlocked ? 'Usuário bloqueado com sucesso.' : 'Usuário desbloqueado com sucesso.')
}

async function listEvents(req, res) {
  const { page, limit } = parsePagination(req.query)
  const data = await adminService.getEvents(readSearch(req), page, limit)
  return success(res, data, 'Eventos listados com sucesso.')
}

async function removeEvent(req, res) {
  const id = parseId(req.params.id, 'evento')
  const data = await eventService.removeEvent(id, req.user.id, true)
  return success(res, data, 'Evento excluído com sucesso.')
}

module.exports = { dashboard, listReports, reviewReport, listUsers, blockUser, listEvents, removeEvent }