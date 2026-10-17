const { body, validationResult } = require('express-validator')
const fs = require('fs/promises')
const { VALIDATION } = require('../../config/constants')

const eventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('O título é obrigatório.')
    .bail()
    .isLength({ max: VALIDATION.TITLE_MAX })
    .withMessage(
      `O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('A descrição é obrigatória.')
    .bail()
    .isLength({ max: VALIDATION.DESCRIPTION_MAX })
    .withMessage(
      `A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`
    ),

  async (req, res, next) => {
    const result = validationResult(req)

    if (!result.isEmpty() || !req.file) {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path)
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error(
              'Erro ao limpar arquivo inválido:',
              error
            )
          }
        }
      }

      return res.status(400).json({
        success: false,
        message: !req.file
          ? 'A imagem do evento é obrigatória.'
          : 'Dados inválidos.',
        errors: result.array()
      })
    }

    return next()
  }
]

module.exports = eventValidator
