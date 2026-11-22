const { body, query, validationResult } = require('express-validator')
const { ADMIN } = require('../../config/constants')

function validate(req, res, next) {
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

const reportsFilterValidator = [
  query('status')
    .optional()
    .isIn(ADMIN.REPORT_FILTERS)
    .withMessage('Filtro de situação inválido.'),
  validate
]

const blockUserValidator = [
  body('isBlocked')
    .exists()
    .withMessage('Informe se o usuário deve ficar bloqueado (isBlocked).')
    .bail()
    .isBoolean({ strict: true })
    .withMessage('isBlocked deve ser verdadeiro ou falso.'),
  validate
]

module.exports = { reportsFilterValidator, blockUserValidator }