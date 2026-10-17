const { body, validationResult } = require('express-validator')
const { VALIDATION } = require('../../config/constants')

const commentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('O comentário não pode ficar vazio.')
    .bail()
    .isLength({ max: VALIDATION.COMMENT_MAX })
    .withMessage(
      `O comentário deve ter no máximo ${VALIDATION.COMMENT_MAX} caracteres.`
    ),

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

module.exports = commentValidator