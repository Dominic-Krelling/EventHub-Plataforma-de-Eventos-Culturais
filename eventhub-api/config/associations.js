const User = require('../modules/user/userModel')
const Event = require('../modules/event/eventModel')

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
  initialized = true
}

module.exports = setupAssociations
