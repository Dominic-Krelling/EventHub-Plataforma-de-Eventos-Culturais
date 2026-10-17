const express = require('express')
const router = express.Router()

const commentController = require('./commentController')
const commentValidator = require('./commentValidator')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')

router.post(
  '/events/:eventId/comments',
  isAuthenticated,
  commentValidator,
  asyncHandler(commentController.create)
)

router.get(
  '/events/:eventId/comments',
  asyncHandler(commentController.list)
)

module.exports = router