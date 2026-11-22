const express = require('express')
const router = express.Router()

const adminController = require('./adminController')
const { reportsFilterValidator, blockUserValidator } = require('./adminValidator')
const asyncHandler = require('../../middlewares/asyncHandler')
const { isAuthenticated, isAdmin } = require('../../middlewares/auth')

router.use('/admin', isAuthenticated, isAdmin)

router.get('/admin/dashboard', asyncHandler(adminController.dashboard))

router.get('/admin/reports', reportsFilterValidator, asyncHandler(adminController.listReports))
router.patch('/admin/reports/:id/review', asyncHandler(adminController.reviewReport))

router.get('/admin/users', asyncHandler(adminController.listUsers))
router.patch('/admin/users/:id/block', blockUserValidator, asyncHandler(adminController.blockUser))

router.get('/admin/events', asyncHandler(adminController.listEvents))
router.delete('/admin/events/:id', asyncHandler(adminController.removeEvent))

module.exports = router