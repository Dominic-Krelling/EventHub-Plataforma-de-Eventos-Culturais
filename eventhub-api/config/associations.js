
const User = require('../modules/user/userModel')
const Event = require('../modules/event/eventModel')
const Like = require('../modules/like/likeModel')
const Comment = require('../modules/comment/commentModel')
const Follow = require('../modules/follow/followModel')
const Collection = require('../modules/collection/collectionModel')
const CollectionEvent = require('../modules/collection/collectionEventModel')

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

  Follow.belongsTo(User, {
    as: 'Follower',
    foreignKey: 'followerId'
  })

  Follow.belongsTo(User, {
    as: 'Following',
    foreignKey: 'followingId'
  })

  // Coleções: relacionamento entre coleção e eventos.
  Collection.hasMany(CollectionEvent, {
    foreignKey: 'collectionId',
    as: 'items',
    onDelete: 'CASCADE'
  })

  CollectionEvent.belongsTo(Collection, {
    foreignKey: 'collectionId',
    as: 'collection'
  })

  Event.hasMany(CollectionEvent, {
    foreignKey: 'eventId',
    as: 'collectionLinks',
    onDelete: 'CASCADE'
  })

  CollectionEvent.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
  })

  User.hasMany(Collection, {
    foreignKey: 'userId',
    as: 'collections',
    onDelete: 'CASCADE'
  })

  Collection.belongsTo(User, {
    foreignKey: 'userId',
    as: 'owner'
  })

  initialized = true
}

module.exports = setupAssociations
