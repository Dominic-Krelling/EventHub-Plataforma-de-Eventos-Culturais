const express = require('express')
const router = express.Router()

const { isAuthenticated } = require('../../middlewares/auth')
const asyncHandler = require('../../middlewares/asyncHandler')
const eventController = require('./eventController')

router.get('/', isAuthenticated, asyncHandler(eventController.feed))

module.exports = router