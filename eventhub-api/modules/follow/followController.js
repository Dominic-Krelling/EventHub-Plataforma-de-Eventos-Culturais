
const followService = require('./followService')
const eventService = require('../event/eventService')
const { parsePagination } = require('../../utils/pagination')
const { parseId } = require('../../utils/parseId')

// req.params.userId é sempre string: a conversão para número acontece aqui, na borda
// (utils/parseId). Sem ela, '5' === 5 daria false e a pessoa seguiria a si mesma.
const parseUserId = parseId

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
    message: data.isFollowing
      ? 'Agora você segue este usuário.'
      : 'Você deixou de seguir este usuário.',
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

  return res.status(200).json({
    success: true,
    message: 'Status do seguir.',
    data
  })
}

async function listFollowers(req, res) {
  const userId = parseUserId(req.params.userId)
  if (!userId) return invalidId(res)

  const data = await followService.getFollowers(userId)

  return res.status(200).json({
    success: true,
    message: 'Seguidores listados com sucesso.',
    data
  })
}

async function listFollowing(req, res) {
  const userId = parseUserId(req.params.userId)
  if (!userId) return invalidId(res)

  const data = await followService.getFollowing(userId)

  return res.status(200).json({
    success: true,
    message: 'Seguindo listados com sucesso.',
    data
  })
}

async function listFollowingEvents(req, res) {
  const { page, limit } = parsePagination(req.query)

  const data = await eventService.getFollowingEvents(
    Number(req.user.id),
    page,
    limit
  )

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
