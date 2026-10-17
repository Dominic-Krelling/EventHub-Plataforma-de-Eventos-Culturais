const Comment = require('./commentModel')
const Event = require('../event/eventModel')
const User = require('../user/userModel')
const sequelize = require('../../config/database')

const publicUserAttributes = ['id', 'username', 'fullName', 'profilePicture']

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

// Objeto como parâmetro: userId, eventId e content não podem ser trocados
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

    await event.increment('commentsCount', { by: 1, transaction: t })

    // devolve o comentário já com o autor
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

module.exports = { createComment, listComments }