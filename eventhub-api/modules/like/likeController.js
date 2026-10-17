const likeService = require('./likeService')

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

async function toggleLike(req, res) {
  const eventId = parseId(req.params.eventId)
  if (!eventId) return invalidId(res)

  const data = await likeService.toggleLike({
    userId: req.user.id,
    eventId
  })

  return res.status(data.liked ? 201 : 200).json({
    success: true,
    message: data.liked ? 'Evento curtido.' : 'Curtida removida.',
    data
  })
}

async function likeStatus(req, res) {
  const eventId = parseId(req.params.eventId)
  if (!eventId) return invalidId(res)

  const data = await likeService.getLikeStatus({
    userId: req.user?.id ?? null,
    eventId
  })

  return res.status(200).json({
    success: true,
    message: 'Status da curtida.',
    data
  })
}

async function listLiked(req, res) {
  const events = await likeService.listLikedEvents(req.user.id)

  return res.status(200).json({
    success: true,
    message: 'Eventos curtidos listados com sucesso.',
    data: events
  })
}

module.exports = { toggleLike, likeStatus, listLiked }