const express = require('express')
const router = express.Router()

const likeController = require('./likeController')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')
const { optionalAuth } = require('../../middlewares/optionalAuth')

router.post(
  '/events/:eventId/toggle-like',
  isAuthenticated,
  asyncHandler(likeController.toggleLike)
)

router.get(
  '/events/:eventId/like-status',
  optionalAuth,
  asyncHandler(likeController.likeStatus)
)

router.get(
  '/liked-events',
  isAuthenticated,
  asyncHandler(likeController.listLiked)
)

module.exports = router