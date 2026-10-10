
const { verifyToken } = require('../config/jwt')

function optionalAuth(req, res, next) {
  req.user = null

  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next()
  }

  const token = authorization.slice(7)

  try {
    req.user = verifyToken(token)
  } catch (error) {
    req.user = null
  }

  next()
}

module.exports = { optionalAuth }
