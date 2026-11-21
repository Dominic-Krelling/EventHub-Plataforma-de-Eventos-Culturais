
const express = require('express')
const router = express.Router()

const collectionController = require('./collectionController')
const { createCollectionValidator } = require('./collectionValidator')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')
const { optionalAuth } = require('../../middlewares/optionalAuth')

router.get(
  '/my-collections',
  isAuthenticated,
  asyncHandler(collectionController.listMine)
)

router.post(
  '/collections',
  isAuthenticated,
  createCollectionValidator,
  asyncHandler(collectionController.create)
)

// Consulta pública: o service controla o acesso às coleções privadas.
router.get(
  '/collections/:id',
  optionalAuth,
  asyncHandler(collectionController.getDetails)
)

router.delete(
  '/collections/:id',
  isAuthenticated,
  asyncHandler(collectionController.remove)
)

router.post(
  '/collections/:id/events',
  isAuthenticated,
  asyncHandler(collectionController.addEvent)
)

router.delete(
  '/collections/:id/events/:eventId',
  isAuthenticated,
  asyncHandler(collectionController.removeEvent)
)

router.get(
  '/events/:eventId/collections-status',
  isAuthenticated,
  asyncHandler(collectionController.collectionsStatus)
)

module.exports = router
