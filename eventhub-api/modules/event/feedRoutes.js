const express = require('express')
const router = express.Router()

const { isAuthenticated } = require('../../middlewares/auth')
const eventService = require('./eventService')

router.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1)
        const limit = Number(req.query.limit ?? 10)

        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 50
        ) {
            return res.status(400).json({
                success: false,
                message: 'Parâmetros de paginação inválidos.',
                errors: []
            })
        }

        const result = await eventService.getFeedEvents({
            page,
            limit
        })

        return res.status(200).json({
            success: true,
            message: 'Feed carregado com sucesso.',
            data: result
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
