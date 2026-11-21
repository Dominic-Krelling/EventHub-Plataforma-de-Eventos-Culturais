const { Op } = require('sequelize')
const sequelize = require('../../config/database')
const Collection = require('./collectionModel')
const CollectionEvent = require('./collectionEventModel')
const Event = require('../event/eventModel')
const User = require('../user/userModel')

const publicUserAttributes = ['id', 'username', 'fullName', 'profilePicture']

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

// 404 se não existe → 403 se é de outra pessoa
async function findOwnedCollectionOrFail(collectionId, userId, options = {}) {
  const collection = await Collection.findByPk(collectionId, options)

  if (!collection) throw httpError('Coleção não encontrada.', 404)

  if (Number(collection.userId) !== Number(userId)) {
    throw httpError('Você não tem permissão para alterar esta coleção.', 403)
  }

  return collection
}

async function createCollection({ userId, title, description, isPublic }) {
  return Collection.create({
    userId,
    title,
    description: description || null,
    isPublic: isPublic === true // só true de verdade
  })
}

// mais nova primeiro; o id desempata (createdAt tem precisão de segundos)
async function getUserCollections(userId) {
  return Collection.findAll({
    where: { userId },
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })
}

async function getCollectionById(collectionId, currentUserId = null) {
  const collection = await Collection.findByPk(collectionId, {
    include: [{ model: User, as: 'owner', attributes: publicUserAttributes }]
  })

  if (!collection) throw httpError('Coleção não encontrada.', 404)

  const isOwner = currentUserId !== null && Number(collection.userId) === Number(currentUserId)

  if (!collection.isPublic && !isOwner) {
    throw httpError('Esta coleção é privada.', 403)
  }

  const rows = await CollectionEvent.findAll({
    where: { collectionId: collection.id },
    include: [{
      model: Event,
      as: 'event',
      include: [{ model: User, as: 'creator', attributes: publicUserAttributes }]
    }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })

  return { collection, events: rows.map((row) => row.event).filter(Boolean), isOwner }
}

async function addEventToCollection({ collectionId, eventId, userId }) {
  const collection = await findOwnedCollectionOrFail(collectionId, userId)

  const event = await Event.findByPk(eventId, { attributes: ['id'] })
  if (!event) throw httpError('Evento não encontrado.', 404)

  return sequelize.transaction(async (transaction) => {
    const [, created] = await CollectionEvent.findOrCreate({
      where: { collectionId: collection.id, eventId: event.id },
      transaction
    })

    if (created) {
      await collection.increment('eventsCount', { by: 1, transaction })
    }

    await collection.reload({ transaction })

    return { added: created, eventsCount: collection.eventsCount }
  })
}

async function removeEventFromCollection({ collectionId, eventId, userId }) {
  const collection = await findOwnedCollectionOrFail(collectionId, userId)

  return sequelize.transaction(async (transaction) => {
    const removed = await CollectionEvent.destroy({
      where: { collectionId: collection.id, eventId },
      transaction
    })

    if (removed === 0) throw httpError('Este item não está na coleção.', 404)

    await collection.decrement('eventsCount', { by: 1, transaction })
    await collection.reload({ transaction })

    return { eventsCount: collection.eventsCount }
  })
}

async function deleteCollection({ collectionId, userId }) {
  const collection = await findOwnedCollectionOrFail(collectionId, userId)

  await sequelize.transaction(async (transaction) => {
    await CollectionEvent.destroy({ where: { collectionId: collection.id }, transaction })
    await collection.destroy({ transaction })
  })

  return { id: collection.id }
}

async function getCollectionsStatusForEvent(userId, eventId) {
  const event = await Event.findByPk(eventId, { attributes: ['id'] })
  if (!event) throw httpError('Evento não encontrado.', 404)

  const collections = await Collection.findAll({
    where: { userId },
    attributes: ['id', 'title', 'isPublic', 'eventsCount'],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })

  if (collections.length === 0) return []

  const rows = await CollectionEvent.findAll({
    where: { eventId: event.id, collectionId: { [Op.in]: collections.map((c) => c.id) } },
    attributes: ['collectionId']
  })

  const containing = new Set(rows.map((row) => row.collectionId))

  return collections.map((c) => ({
    id: c.id,
    title: c.title,
    isPublic: c.isPublic,
    eventsCount: c.eventsCount,
    hasEvent: containing.has(c.id)
  }))
}

module.exports = {
  createCollection,
  getUserCollections,
  getCollectionById,
  addEventToCollection,
  removeEventFromCollection,
  deleteCollection,
  getCollectionsStatusForEvent
}