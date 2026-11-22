const { Op, fn, col } = require('sequelize')

const User = require('../user/userModel')
const Event = require('../event/eventModel')
const Comment = require('../comment/commentModel')
const Like = require('../like/likeModel')
const Report = require('../report/reportModel')
const { REPORT } = require('../../config/constants')
const { escapeLike } = require('../../utils/escapeLike')

const publicUserAttributes = ['id', 'username', 'fullName', 'profilePicture']

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

function likeFilter(search, fields) {
  if (!search) return {}

  const pattern = `%${escapeLike(search)}%`

  return { [Op.or]: fields.map((field) => ({ [field]: { [Op.like]: pattern } })) }
}

async function getDashboardStats() {
  const [users, blockedUsers, events, comments, likes, pendingReports, reviewedReports] =
    await Promise.all([
      User.count(),
      User.count({ where: { isBlocked: true } }),
      Event.count(),
      Comment.count(),
      Like.count(),
      Report.count({ where: { status: REPORT.STATUS.PENDING } }),
      Report.count({ where: { status: REPORT.STATUS.REVIEWED } })
    ])

  return { users, blockedUsers, events, comments, likes, pendingReports, reviewedReports }
}

async function getReports(status, page, limit) {
  return Report.findAll({
    where: status === 'all' ? {} : { status },
    include: [
      { model: User, as: 'Reporter', attributes: publicUserAttributes },
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'image'],
        include: [{ model: User, as: 'creator', attributes: publicUserAttributes }]
      }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset: (page - 1) * limit
  })
}

async function reviewReport(id) {
  const report = await Report.findByPk(id)

  if (!report) throw httpError('Denúncia não encontrada.', 404)

  if (report.status !== REPORT.STATUS.REVIEWED) {
    await report.update({ status: REPORT.STATUS.REVIEWED, reviewedAt: new Date() })
  }

  await report.reload()

  return { id: report.id, status: report.status, reviewedAt: report.reviewedAt }
}

async function getUsers(search, page, limit) {
  return User.findAll({
    attributes: [
      'id', 'username', 'email', 'fullName', 'profilePicture',
      'isBlocked', 'isAdmin', 'followersCount', 'followingCount', 'eventsCount', 'createdAt'
    ],
    where: likeFilter(search, ['username', 'email', 'fullName']),
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset: (page - 1) * limit
  })
}

async function setUserBlocked(targetId, isBlocked, adminId) {
  const target = await User.findByPk(targetId)

  if (!target) throw httpError('Usuário não encontrado.', 404)

  if (Number(target.id) === Number(adminId)) {
    throw httpError('Você não pode bloquear a si mesmo.', 400)
  }

  if (target.isAdmin) {
    throw httpError('Não é possível bloquear outro administrador.', 403)
  }

  if (Boolean(target.isBlocked) !== isBlocked) {
    await target.update({ isBlocked })
  }

  return { id: target.id, username: target.username, isBlocked: Boolean(target.isBlocked) }
}

async function getEvents(search, page, limit) {
  const events = await Event.findAll({
    where: likeFilter(search, ['title']),
    include: [{ model: User, as: 'creator', attributes: publicUserAttributes }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset: (page - 1) * limit
  })

  if (events.length === 0) return []

  const rows = await Report.findAll({
    attributes: ['eventId', [fn('COUNT', col('id')), 'total']],
    where: {
      eventId: { [Op.in]: events.map((event) => event.id) },
      status: REPORT.STATUS.PENDING
    },
    group: ['eventId'],
    raw: true
  })

  const pendingByEvent = new Map(rows.map((row) => [Number(row.eventId), Number(row.total)]))

  return events.map((event) => ({
    ...event.toJSON(),
    pendingReportsCount: pendingByEvent.get(Number(event.id)) ?? 0
  }))
}

module.exports = {
  getDashboardStats,
  getReports,
  reviewReport,
  getUsers,
  setUserBlocked,
  getEvents
}