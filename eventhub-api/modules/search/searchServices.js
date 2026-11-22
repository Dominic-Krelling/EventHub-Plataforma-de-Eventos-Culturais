const { Op } = require('sequelize')

const Event = require('../event/eventModel')
const User = require('../user/userModel')

const { SEARCH } = require('../../config/constants')
const { escapeLike } = require('../../utils/escapeLike')

const publicUserAttributes = [
  'id',
  'username',
  'fullName',
  'bio',
  'profilePicture'
]

async function searchEvents(text) {
  return Event.findAll({
    where: {
      title: {
        [Op.like]: `%${escapeLike(text)}%`
      }
    },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: publicUserAttributes
      }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit: SEARCH.LIMIT
  })
}

async function searchUsers(text) {
  const pattern = `%${escapeLike(text)}%`

  return User.findAll({
    attributes: publicUserAttributes,
    where: {
      [Op.or]: [
        { username: { [Op.like]: pattern } },
        { fullName: { [Op.like]: pattern } }
      ]
    },
    order: [['username', 'ASC']],
    limit: SEARCH.LIMIT
  })
}

async function globalSearch(text) {
  const [events, users] = await Promise.all([
    searchEvents(text),
    searchUsers(text)
  ])

  return { events, users }
}

module.exports = {
  escapeLike,
  searchEvents,
  searchUsers,
  globalSearch
}
