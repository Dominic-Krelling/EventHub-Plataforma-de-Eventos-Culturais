const commentService = require('./commentService')

function parseId(value) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function invalidId(res) {
  return res.status(400).json({
    success: false,
    message: 'ID do evento inválido.',
    errors: []
  })
}

async function create(req, res) {
  const eventId = parseId(req.params.eventId)
  if (!eventId) return invalidId(res)

  const comment = await commentService.createComment({
    userId: req.user.id,
    eventId,
    content: req.body.content
  })

  return res.status(201).json({
    success: true,
    message: 'Comentário publicado.',
    data: comment
  })
}

async function list(req, res) {
  const eventId = parseId(req.params.eventId)
  if (!eventId) return invalidId(res)

  const comments = await commentService.listComments(eventId)

  return res.status(200).json({
    success: true,
    message: 'Comentários listados com sucesso.',
    data: comments
  })
}

module.exports = { create, list }