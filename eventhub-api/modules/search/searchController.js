const searchService = require('./searchServices')
const { success } = require('../../middlewares/apiResponse')
const { SEARCH } = require('../../config/constants')

// GET /api/search?q=termo  (pública)
async function search(req, res) {
  // ?q=a&q=b vira array e ?q[x]=1 vira objeto: só texto é aceito.
  const raw = typeof req.query.q === 'string' ? req.query.q : ''
  const query = raw.trim().slice(0, SEARCH.MAX_LENGTH)

  if (query.length < SEARCH.MIN_LENGTH) {
    return success(res, { query, events: [], users: [] })
  }

  // O await é obrigatório: sem ele o spread espalharia uma Promise e as listas sumiriam.
  const results = await searchService.globalSearch(query)

  return success(res, { query, ...results })
}

module.exports = { search }