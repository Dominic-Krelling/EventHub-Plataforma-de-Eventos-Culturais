/**
 * Converte um parâmetro de rota (sempre string) em id numérico.
 * Devolve null quando não é um inteiro positivo seguro ('abc', '-1', '0', '1.5').
 * O controller responde 400 nesse caso; o Service já recebe um número.
 */
function parseId(value) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

module.exports = { parseId }