const fs = require('fs/promises')
const path = require('path')

const Event = require('./eventModel')
const User = require('../user/userModel')

async function createEvent(data) {
  return Event.sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(data.userId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!user) {
      const error = new Error('Usuário não encontrado.')
      error.status = 404
      throw error
    }

    const event = await Event.create({
      title: data.title,
      description: data.description,
      image: data.image,
      userId: data.userId
    }, { transaction })

    await user.increment('eventsCount', {
      by: 1,
      transaction
    })

    return event
  })
}

async function getAllEvents() {
  return Event.findAll({
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'fullName']
    }],
    order: [['createdAt', 'DESC']]
  })
}

async function getEventById(id) {
  return Event.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'fullName']
    }]
  })
}

async function deleteUploadedImage(filename) {
  if (!filename) return

  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'uploads',
    'events',
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

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteUploadedImage
}
