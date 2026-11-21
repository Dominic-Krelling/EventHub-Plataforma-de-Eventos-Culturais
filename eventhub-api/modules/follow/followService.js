const { Op } = require('sequelize')
const sequelize = require('../../config/database')
const User = require('../user/userModel')
const Follow = require('./followModel')

const publicUserAttributes = ['id', 'username', 'fullName', 'bio', 'profilePicture']

const { NOTIFICATION } = require('../../config/constants')
const {
  createNotification,
  removeNotification
} = require('../notification/notificationService')

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

async function toggleFollow({ followerId, followingId }) {
  if (Number(followerId) === Number(followingId)) {
    throw httpError('Você não pode seguir a si mesmo.', 400)
  }

  const target = await User.findByPk(followingId)
  if (!target) throw httpError('Usuário não encontrado.', 404)

  return sequelize.transaction(async (t) => {
    const [follow, created] = await Follow.findOrCreate({
      where: { followerId, followingId },
      transaction: t
    })

    let isFollowing

    if (created) {
      await User.increment('followersCount', {
        by: 1,
        where: { id: followingId },
        transaction: t
      })

      await User.increment('followingCount', {
        by: 1,
        where: { id: followerId },
        transaction: t
      })

      await createNotification({
        userId: followingId,
        actorId: followerId,
        type: NOTIFICATION.TYPES.FOLLOW
      }, t)

      isFollowing = true
    } else {
      await follow.destroy({ transaction: t })

      await User.decrement('followersCount', {
        by: 1,
        where: {
          id: followingId,
          followersCount: { [Op.gt]: 0 }
        },
        transaction: t
      })

      await User.decrement('followingCount', {
        by: 1,
        where: {
          id: followerId,
          followingCount: { [Op.gt]: 0 }
        },
        transaction: t
      })

      await removeNotification({
        userId: followingId,
        actorId: followerId,
        type: NOTIFICATION.TYPES.FOLLOW
      }, t)

      isFollowing = false
    }

    await target.reload({ transaction: t })

    return {
      isFollowing,
      followersCount: target.followersCount
    }
  })
}

async function getFollowStatus({ followerId, followingId }) {
  const target = await User.findByPk(followingId, {
    attributes: ['id']
  })

  if (!target) throw httpError('Usuário não encontrado.', 404)

  const follow = await Follow.findOne({
    where: { followerId, followingId }
  })

  return {
    isFollowing: Boolean(follow)
  }
}

async function assertUserExists(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id']
  })

  if (!user) throw httpError('Usuário não encontrado.', 404)
}

async function getFollowers(userId) {
  await assertUserExists(userId)

  const rows = await Follow.findAll({
    where: { followingId: userId },
    include: [{
      model: User,
      as: 'Follower',
      attributes: publicUserAttributes
    }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })

  return rows.map((row) => row.Follower)
}


async function getFollowing(userId) {
  await assertUserExists(userId)

  const rows = await Follow.findAll({
    where: { followerId: userId },
    include: [{
      model: User,
      as: 'Following',
      attributes: publicUserAttributes
    }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  })

  return rows.map((row) => row.Following)
}

async function isFollowing(followerId, followingId) {
  const follow = await Follow.findOne({
    where: { followerId, followingId }
  })

  return Boolean(follow)
}

module.exports = {
  toggleFollow,
  getFollowStatus,
  getFollowers,
  getFollowing,
  isFollowing
}
