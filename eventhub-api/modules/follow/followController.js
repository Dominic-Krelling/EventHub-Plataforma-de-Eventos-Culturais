
const followService = require('./followService')
const eventService = require('../event/eventService')
const { parsePagination } = require('../../utils/pagination')
const { parseId } = require('../../utils/parseId')

async function toggleFollow(req, res) {
  const followingId = parseId(req.params.userId, 'usuário')

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
  const followingId = parseId(req.params.userId, 'usuário')

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
  const userId = parseId(req.params.userId, 'usuário')

  const data = await followService.getFollowers(userId)

  return res.status(200).json({
    success: true,
    message: 'Seguidores listados com sucesso.',
    data
  })
}

async function listFollowing(req, res) {
  const userId = parseId(req.params.userId, 'usuário')

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
