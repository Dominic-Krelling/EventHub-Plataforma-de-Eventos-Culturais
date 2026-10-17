const multer = require('multer')
const { ValidationError, UniqueConstraintError } = require('sequelize')

function errorHandler(err, req, res, next) {
  console.error('Erro na API:', err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE'
        ? 'O arquivo excede o limite de 5 MB.'
        : err.message,
      errors: []
    })
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação.',
      errors: err.errors.map(error => ({
        field: error.path,
        message: error.message
      }))
    })
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: 'Já existe um registro com esses dados.',
      errors: []
    })
  }

  const statusCode =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500
      ? 'Erro interno do servidor.'
      : err.message,
    errors: []
  })
}

module.exports = errorHandler
