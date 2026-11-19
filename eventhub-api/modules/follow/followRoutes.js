const express = require('express')
const router = express.Router()

const followController = require('./followController')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')

router.post(
  '/users/:userId/toggle-follow',
  isAuthenticated,
  asyncHandler(followController.toggleFollow)
)

router.get(
  '/users/:userId/follow-status',
  isAuthenticated,
  asyncHandler(followController.followStatus)
)

// Listas públicas
router.get('/users/:userId/followers', asyncHandler(followController.listFollowers))
router.get('/users/:userId/following', asyncHandler(followController.listFollowing))

// Feed de quem eu sigo
router.get(
  '/following-events',
  isAuthenticated,
  asyncHandler(followController.listFollowingEvents)
)

module.exports = router