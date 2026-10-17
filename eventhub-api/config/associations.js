const User = require('../modules/user/userModel')
const Event = require('../modules/event/eventModel')
const Like = require('../modules/like/likeModel')
const Comment = require('../modules/comment/commentModel')

let initialized = false

function setupAssociations() {
  if (initialized) return
  User.hasMany(Event, {
    foreignKey: 'userId',
    as: 'events'
  })
  Event.belongsTo(User, {
    foreignKey: 'userId',
    as: 'creator'
  })
  User.hasMany(Like, { foreignKey: 'userId' })
  Like.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  Event.hasMany(Like, { foreignKey: 'eventId' })
  Like.belongsTo(Event, { foreignKey: 'eventId', as: 'event' })

  User.hasMany(Comment, { foreignKey: 'userId' })
  Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' })

  Event.hasMany(Comment, { foreignKey: 'eventId' })
  Comment.belongsTo(Event, { foreignKey: 'eventId', as: 'event' })
  initialized = true
}

module.exports = setupAssociations
