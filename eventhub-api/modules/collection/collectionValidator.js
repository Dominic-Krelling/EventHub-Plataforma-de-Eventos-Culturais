const { body, validationResult } = require('express-validator')
const { VALIDATION } = require('../../config/constants')

const { COLLECTION_TITLE_MIN: MIN, COLLECTION_TITLE_MAX: MAX, COLLECTION_DESCRIPTION_MAX } = VALIDATION

const createCollectionValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('O título da coleção é obrigatório.')
    .bail()
    .isLength({ min: MIN, max: MAX })
    .withMessage(`O título deve ter entre ${MIN} e ${MAX} caracteres.`),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: COLLECTION_DESCRIPTION_MAX })
    .withMessage(`A descrição deve ter no máximo ${COLLECTION_DESCRIPTION_MAX} caracteres.`),

  body('isPublic')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('isPublic deve ser true ou false.')
    .bail()
    .custom((value) => typeof value === 'boolean')
    .withMessage('isPublic deve ser true ou false.'),

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

module.exports = { createCollectionValidator }