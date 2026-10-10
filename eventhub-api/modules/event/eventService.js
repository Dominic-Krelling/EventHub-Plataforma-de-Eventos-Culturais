const fs = require('fs/promises')
const path = require('path')
const { Op } = require('sequelize')

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

async function getFeedEvents({ page = 1, limit = 10 } = {}) {
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

// Mantém compatibilidade com a listagem da Aula 07.
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

async function findEventById(id) {
  return Event.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: publicUserAttributes
    }]
  })
}

module.exports = {
  createEvent,
  deleteEventImage,
  getEventDetails,
  getFeedEvents,
  listEvents,
  findEventById,
  list: listEvents,
  findById: findEventById
}
