function escapeLike(text) {
  return String(text).replace(/[\\%_]/g, '\\$&')
}

module.exports = { escapeLike }