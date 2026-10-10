
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const uploadDir = path.join(
  __dirname,
  '..',
  'public',
  'uploads',
  'events'
)

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir)
  },

  filename(req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase()
    const unique = crypto.randomBytes(12).toString('hex')

    callback(null, `event-${Date.now()}-${unique}${ext}`)
  }
})

const allowedTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
}

function fileFilter(req, file, callback) {
  const ext = path.extname(file.originalname).toLowerCase()
  const extensions = allowedTypes[file.mimetype]

  if (!extensions || !extensions.includes(ext)) {
    const error = new Error(
      'Formato inválido. Utilize JPG, PNG ou WEBP.'
    )

    error.status = 400
    return callback(error)
  }

  callback(null, true)
}

const eventUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

module.exports = eventUpload
