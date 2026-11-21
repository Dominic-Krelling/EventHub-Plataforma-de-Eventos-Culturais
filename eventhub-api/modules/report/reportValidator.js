const { body, validationResult } = require('express-validator')
const { REPORT } = require('../../config/constants')

const reportValidator = [
  body('reason')
    .isIn(Object.values(REPORT.REASONS))
    .withMessage('Escolha um motivo válido para a denúncia.'),

  (req, res, next) => {
    const result = validationResult(req)

    if (!result.isEmpty()) {
      const errors = result.array()

      return res.status(400).json({
        success: false,
        message: errors[0].msg,
        errors: errors.map((e) => ({ field: e.path, message: e.msg }))
      })
    }

    return next()
  }
]

module.exports = { reportValidator }