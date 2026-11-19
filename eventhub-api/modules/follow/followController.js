const followService = require('./followService')
const eventService = require('../event/eventService')

// req.params.userId é sempre string: a conversão para número acontece aqui, na borda.
// Sem ela, '5' === 5 daria false e a pessoa conseguiria seguir a si mesma.
function parseUserId(value) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function invalidId(res) {
  return res.status(400).json({
    success: false,
    message: 'ID do usuário inválido.',
    errors: []
  })
}

async function toggleFollow(req, res) {
  const followingId = parseUserId(req.params.userId)
  if (!followingId) return invalidId(res)

  const data = await followService.toggleFollow({
    followerId: Number(req.user.id),
    followingId
  })

  return res.status(data.isFollowing ? 201 : 200).json({
    success: true,
    message: data.isFollowing ? 'Agora você segue este usuário.' : 'Você deixou de seguir este usuário.',
    data
  })
}

async function followStatus(req, res) {
  const followingId = parseUserId(req.params.userId)
  if (!followingId) return invalidId(res)

  const data = await followService.getFollowStatus({
    followerId: Number(req.user.id),
    followingId
  })

  return res.status(200).json({ success: true, message: 'Status do seguir.', data })
}

async function listFollowers(req, res) {
  const userId = parseUserId(req.params.userId)
  if (!userId) return invalidId(res)

  const data = await followService.getFollowers(userId)

  return res.status(200).json({ success: true, message: 'Seguidores listados com sucesso.', data })
}

async function listFollowing(req, res) {
  const userId = parseUserId(req.params.userId)
  if (!userId) return invalidId(res)

  const data = await followService.getFollowing(userId)

  return res.status(200).json({ success: true, message: 'Seguindo listados com sucesso.', data })
}

async function listFollowingEvents(req, res) {
  const page = Number(req.query.page ?? 1)
  const limit = Number(req.query.limit ?? 12)

  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(limit) ||
    page < 1 ||
    limit < 1 ||
    limit > 50
  ) {
    return res.status(400).json({
      success: false,
      message: 'Parâmetros de paginação inválidos.',
      errors: []
    })
  }

  const data = await eventService.getFollowingEvents(Number(req.user.id), page, limit)

  return res.status(200).json({
    success: true,
    message: 'Eventos de quem você segue.',
    data
  })
}

module.exports = {
  toggleFollow,
  followStatus,
  listFollowers,
  listFollowing,
  listFollowingEvents
}