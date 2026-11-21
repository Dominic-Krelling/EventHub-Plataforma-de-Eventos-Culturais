
const Comment = require('./commentModel')
const Event = require('../event/eventModel')
const User = require('../user/userModel')
const sequelize = require('../../config/database')

const publicUserAttributes = ['id', 'username', 'fullName', 'profilePicture']

const { NOTIFICATION } = require('../../config/constants')
const { createNotification } = require('../notification/notificationService')

const authorInclude = {
  model: User,
  as: 'author',
  attributes: publicUserAttributes
}

function notFound() {
  const error = new Error('Evento não encontrado.')
  error.status = 404
  return error
}

async function createComment({ userId, eventId, content }) {
  return sequelize.transaction(async (t) => {
    const event = await Event.findByPk(eventId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    })

    if (!event) throw notFound()

    const comment = await Comment.create(
      { userId, eventId, content },
      { transaction: t }
    )

    await event.increment('commentsCount', {
      by: 1,
      transaction: t
    })

    if (event.userId !== userId) {
      await createNotification({
        userId: event.userId,
        actorId: userId,
        type: NOTIFICATION.TYPES.COMMENT,
        eventId
      }, t)
    }

    return Comment.findByPk(comment.id, {
      include: [authorInclude],
      transaction: t
    })
  })
}

async function listComments(eventId) {
  const event = await Event.findByPk(eventId)

  if (!event) throw notFound()

  return Comment.findAll({
    where: { eventId },
    include: [authorInclude],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })
}

module.exports = {
  createComment,
  listComments
}
