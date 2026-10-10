const express = require('express')

const eventController = require('./eventController')
const eventValidator = require('./eventValidator')
const eventUpload = require('../../middlewares/eventMulter')

const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')

const router = express.Router()

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
  asyncHandler(eventController.findById)
)

module.exports = router
