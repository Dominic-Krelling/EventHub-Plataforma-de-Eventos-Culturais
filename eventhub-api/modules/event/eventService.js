const fs = require('fs/promises')
const path = require('path')

const Event = require('./eventModel')
const User = require('../user/userModel')
const sequelize = require('../../config/database')

const publicUserAttributes = [
  'id',
  'username',
  'fullName',
  'profilePicture'
]

async function createEvent({ title, description, image, userId }) {
  return sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!user) {
      const error = new Error('Usuário não encontrado.')
      error.status = 404
      throw error
    }

    const event = await Event.create({
      title,
      description,
      image,
      userId
    }, { transaction })

    await user.increment('eventsCount', {
      by: 1,
      transaction
    })

    return event
  })
}

async function deleteEventImage(filename) {
  if (!filename) return

  const filePath = path.join(
    __dirname,
    '../../public/uploads/events',
    path.basename(filename)
  )

  try {
    await fs.unlink(filePath)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Erro ao remover imagem:', error)
    }
  }
}

async function getEventDetails(id, currentUserId = null) {
  const event = await Event.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }]
  })

  if (!event) return null

  await event.increment('viewsCount', { by: 1 })

  await event.reload({
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }]
  })

  const data = event.toJSON()

  return {
    ...data,
    isOwner:
      currentUserId != null &&
      Number(data.userId) === Number(currentUserId)
  }
}

async function getFeedEvents({ page = 1, limit = 6 } = {}) {
  const offset = (page - 1) * limit

  const { count, rows } = await Event.findAndCountAll({
    attributes: [
      'id',
      'title',
      'description',
      'image',
      'userId',
      'viewsCount',
      'createdAt'
    ],
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC']
    ],
    limit,
    offset
  })

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      hasMore: offset + rows.length < count
    }
  }
}

async function listEvents() {
  return Event.findAll({
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }],
    order: [['createdAt', 'DESC']]
  })
}

async function listMyEvents(userId) {
  return Event.findAll({
    where: { userId },
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }],
    order: [['createdAt', 'DESC']]
  })
}

async function findEventById(id) {
  return Event.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }]
  })
}

async function updateEvent(id, userId, data, imageFilename) {
  const event = await Event.findByPk(id)

  if (!event) {
    const error = new Error('Evento não encontrado.')
    error.status = 404
    throw error
  }

  if (Number(event.userId) !== Number(userId)) {
    const error = new Error('Você não tem permissão para editar este evento.')
    error.status = 403
    throw error
  }

  const oldImage = event.image

  if (data.title !== undefined) {
    event.title = data.title
  }

  if (data.description !== undefined) {
    event.description = data.description
  }

  if (imageFilename) {
    event.image = imageFilename
  }

  await event.save()

  if (
    imageFilename &&
    oldImage &&
    oldImage !== imageFilename
  ) {
    await deleteEventImage(oldImage)
  }

  return getEventDetails(event.id, userId)
}

async function removeEvent(id, userId) {
  const event = await Event.findByPk(id)

  if (!event) {
    const error = new Error('Evento não encontrado.')
    error.status = 404
    throw error
  }

  if (Number(event.userId) !== Number(userId)) {
    const error = new Error('Você não tem permissão para excluir este evento.')
    error.status = 403
    throw error
  }

  const image = event.image
  const owner = await User.findByPk(userId)

  await sequelize.transaction(async (transaction) => {
    await event.destroy({ transaction })

    if (owner && Number(owner.eventsCount) > 0) {
      await owner.decrement('eventsCount', {
        by: 1,
        transaction
      })
    }
  })

  if (image) {
    await deleteEventImage(image)
  }

  return { id: event.id }
}

module.exports = {
  createEvent,
  deleteEventImage,
  getEventDetails,
  getFeedEvents,
  listEvents,
  listMyEvents,
  findEventById,
  updateEvent,
  removeEvent,
  list: listEvents,
  findById: findEventById
}