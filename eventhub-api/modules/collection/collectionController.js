
const collectionService = require('./collectionService')
const { parseId } = require('../../utils/parseId')

async function create(req, res) {
  const collection = await collectionService.createCollection({
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    isPublic: req.body.isPublic
  })

  return res.status(201).json({
    success: true,
    message: 'Coleção criada com sucesso.',
    data: collection
  })
}

async function listMine(req, res) {
  const collections = await collectionService.getUserCollections(req.user.id)

  return res.status(200).json({
    success: true,
    message: 'Coleções listadas com sucesso.',
    data: collections
  })
}

async function getDetails(req, res) {
  const collectionId = parseId(req.params.id, 'coleção')

  const { collection, events, isOwner } =
    await collectionService.getCollectionById(
      collectionId,
      req.user?.id ?? null
    )

  return res.status(200).json({
    success: true,
    message: 'Coleção encontrada.',
    data: { ...collection.toJSON(), events, isOwner }
  })
}

async function addEvent(req, res) {
  const collectionId = parseId(req.params.id, 'coleção')
  const eventId = parseId(req.body?.eventId, 'evento')

  const data = await collectionService.addEventToCollection({
    collectionId,
    eventId,
    userId: req.user.id
  })

  return res.status(data.added ? 201 : 200).json({
    success: true,
    message: data.added
      ? 'Evento adicionado à coleção.'
      : 'O evento já estava na coleção.',
    data
  })
}

async function removeEvent(req, res) {
  const collectionId = parseId(req.params.id, 'coleção')
  const eventId = parseId(req.params.eventId, 'evento')

  const data = await collectionService.removeEventFromCollection({
    collectionId,
    eventId,
    userId: req.user.id
  })

  return res.status(200).json({
    success: true,
    message: 'Evento removido da coleção.',
    data
  })
}

async function remove(req, res) {
  const collectionId = parseId(req.params.id, 'coleção')

  const data = await collectionService.deleteCollection({
    collectionId,
    userId: req.user.id
  })

  return res.status(200).json({
    success: true,
    message: 'Coleção excluída com sucesso.',
    data
  })
}

async function collectionsStatus(req, res) {
  const eventId = parseId(req.params.eventId, 'evento')

  const data = await collectionService.getCollectionsStatusForEvent(
    req.user.id,
    eventId
  )

  return res.status(200).json({
    success: true,
    message: 'Status das coleções.',
    data
  })
}

module.exports = {
  create,
  listMine,
  getDetails,
  addEvent,
  removeEvent,
  remove,
  collectionsStatus
}
