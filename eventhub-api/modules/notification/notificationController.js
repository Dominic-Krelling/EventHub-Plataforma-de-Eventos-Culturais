const notificationService = require('./notificationService')
const { parsePagination } = require('../../utils/pagination')
const { parseId } = require('../../utils/parseId')

async function list(req, res) {
  const { page, limit } = parsePagination(req.query)

  const data = await notificationService.getUserNotifications(req.user.id, page, limit)

  return res.status(200).json({ success: true, message: 'Notificações listadas com sucesso.', data })
}

async function unreadCount(req, res) {
  const count = await notificationService.getUnreadCount(req.user.id)

  return res.status(200).json({ success: true, message: 'Contagem de não lidas.', data: { unreadCount: count } })
}

async function markAsRead(req, res) {
  const id = parseId(req.params.id, 'notificação')

  const data = await notificationService.markAsRead(id, req.user.id)

  return res.status(200).json({ success: true, message: 'Notificação marcada como lida.', data })
}

module.exports = { list, unreadCount, markAsRead }