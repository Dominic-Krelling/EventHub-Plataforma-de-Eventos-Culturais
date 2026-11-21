function parseId(rawValue, label) {
  const isNumber = typeof rawValue === 'number'
  const isDigits = typeof rawValue === 'string' && /^\d+$/.test(rawValue)
  const id = isNumber || isDigits ? Number(rawValue) : NaN

  if (!Number.isSafeInteger(id) || id < 1) {
    const error = new Error(`Identificador de ${label} inválido.`)
    error.status = 400
    throw error
  }

  return id
}

module.exports = { parseId }
