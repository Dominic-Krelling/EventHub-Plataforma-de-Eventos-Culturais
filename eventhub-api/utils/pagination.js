const { PAGINATION } = require('../config/constants')

/**
 * Lê ?page= e ?limit= da query string e devolve números seguros.
 *
 * - Number.parseInt('abc') é NaN, e NaN >= 1 é false: um único teste cobre
 *   "ausente", "texto" e "negativo", e todos caem no valor padrão.
 * - Usamos >= 1 (e não > 1): limit=1 é um valor válido.
 * - limit tem teto (MAX_LIMIT): ?limit=100000 não pode trazer a tabela inteira.
 */
function parsePagination(query = {}) {
  const page = Number.parseInt(query.page, 10)
  const limit = Number.parseInt(query.limit, 10)

  return {
    page: page >= 1 ? page : PAGINATION.DEFAULT_PAGE,
    limit: limit >= 1
      ? Math.min(limit, PAGINATION.MAX_LIMIT)
      : PAGINATION.DEFAULT_LIMIT
  }
}

module.exports = { parsePagination }