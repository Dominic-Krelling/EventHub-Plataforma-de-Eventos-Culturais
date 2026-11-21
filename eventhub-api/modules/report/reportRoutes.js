const express = require('express')
const router = express.Router()

const reportController = require('./reportController')
const { reportValidator } = require('./reportValidator')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated } = require('../../middlewares/auth')

router.post('/events/:eventId/report', isAuthenticated, reportValidator, asyncHandler(reportController.create))

module.exports = router