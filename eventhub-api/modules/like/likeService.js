
import api from './api'

export function getLikedEvents() {
  return api.get('/liked-events')
}

const Like = require('./likeModel')
const Event = require('../event/eventModel')
const User = require('../user/userModel')
const sequelize = require('../../config/database')

const publicUserAttributes = ['id', 'username', 'fullName', 'profilePicture']

function notFound() {
  const error = new Error('Evento não encontrado.')
  error.status = 404
  return error
}

async function toggleLike({ userId, eventId }) {
  return sequelize.transaction(async (t) => {
    // lock: duas curtidas simultâneas no mesmo evento ficam em fila
    const event = await Event.findByPk(eventId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    })

    if (!event) throw notFound()

    const existing = await Like.findOne({
      where: { userId, eventId },
      transaction: t
    })

    let liked

    if (existing) {
      await existing.destroy({ transaction: t })
      await event.decrement('likesCount', { by: 1, transaction: t })
      liked = false
    } else {
      await Like.create({ userId, eventId }, { transaction: t })
      await event.increment('likesCount', { by: 1, transaction: t })
      liked = true
    }

    await event.reload({ transaction: t })

    return { liked, likesCount: event.likesCount }
  })
}

async function getLikeStatus({ userId, eventId }) {
  const event = await Event.findByPk(eventId)

  if (!event) throw notFound()

  let liked = false

  if (userId != null) {
    const like = await Like.findOne({ where: { userId, eventId } })
    liked = Boolean(like)
  }

  return { liked, likesCount: event.likesCount }
}

async function listLikedEvents(userId) {
  const likes = await Like.findAll({
    where: { userId },
    include: [{
      model: Event,
      as: 'event',
      include: [{
        model: User,
        as: 'creator',
        attributes: publicUserAttributes
      }]
    }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })

  return likes.map((like) => like.event).filter(Boolean)
}

module.exports = { toggleLike, getLikeStatus, listLikedEvents }