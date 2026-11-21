const express = require('express')
const router = express.Router()

const notificationController = require('./notificationController')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')

router.get('/notifications', isAuthenticated, asyncHandler(notificationController.list))
router.get('/notifications/unread-count', isAuthenticated, asyncHandler(notificationController.unreadCount))
router.patch('/notifications/:id/read', isAuthenticated, asyncHandler(notificationController.markAsRead))

module.exports = router