const express = require('express')
const router = express.Router()

const eventController = require('./eventController')
const eventValidator = require('./eventValidator')
const eventUpload = require('../../middlewares/eventMulter')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')
const { optionalAuth } = require('../../middlewares/optionalAuth')

router.post(
  '/',
  isAuthenticated,
  eventUpload.single('image'),
  eventValidator,
  asyncHandler(eventController.create)
)

router.get(
  '/mine',
  isAuthenticated,
  asyncHandler(eventController.listMine)
)

router.get(
  '/',
  asyncHandler(eventController.list)
)

router.get(
  '/:id',
  optionalAuth,
  asyncHandler(eventController.findById)
)

router.put(
  '/:id',
  isAuthenticated,
  eventUpload.single('image'),
  asyncHandler(eventController.update)
)

router.delete(
  '/:id',
  isAuthenticated,
  asyncHandler(eventController.remove)
)
router.get('/:id/edit', isAuthenticated, asyncHandler(eventController.getForEdit))


module.exports = router
