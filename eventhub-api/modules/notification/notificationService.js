const Notification = require('./notificationModel')
const Event = require('../event/eventModel')
const User = require('../user/userModel')

const publicUserAttributes = ['id', 'username', 'fullName', 'profilePicture']

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

async function createNotification({ userId, actorId, type, eventId = null }, transaction) {
  if (Number(userId) === Number(actorId)) return null

  return Notification.create({ userId, actorId, type, eventId }, { transaction })
}

async function removeNotification({ userId, actorId, type, eventId = null }, transaction) {
  return Notification.destroy({ where: { userId, actorId, type, eventId }, transaction })
}

async function getUserNotifications(userId, page, limit) {
  return Notification.findAll({
    where: { userId },
    include: [
      { model: User, as: 'Actor', attributes: publicUserAttributes },
      { model: Event, as: 'event', attributes: ['id', 'title', 'image'] }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset: (page - 1) * limit
  })
}

async function getUnreadCount(userId) {
  return Notification.count({ where: { userId, isRead: false } })
}

async function markAsRead(id, userId) {
  const notification = await Notification.findByPk(id)

  if (!notification) throw httpError('Notificação não encontrada.', 404)

  if (Number(notification.userId) !== Number(userId)) {
    throw httpError('Você não tem permissão para alterar esta notificação.', 403)
  }

  if (!notification.isRead) {
    await notification.update({ isRead: true })
  }

  const unreadCount = await getUnreadCount(userId)

  return { id: notification.id, isRead: true, unreadCount }
}

module.exports = { createNotification, removeNotification, getUserNotifications, getUnreadCount, markAsRead }