
const commentService = require('./commentService')
const { parseId } = require('../../utils/parseId')

async function create(req, res) {
  const eventId = parseId(req.params.eventId, 'evento')

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
  const eventId = parseId(req.params.eventId, 'evento')

  const comments = await commentService.listComments(eventId)

  return res.status(200).json({
    success: true,
    message: 'Comentários listados com sucesso.',
    data: comments
  })
}

module.exports = {
  create,
  list
}
