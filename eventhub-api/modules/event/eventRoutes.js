
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
  '/',
  asyncHandler(eventController.list)
)

router.get(
  '/:id',
  optionalAuth,
  asyncHandler(eventController.findById)
)

module.exports = router
