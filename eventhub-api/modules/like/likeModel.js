const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
    indexes: [
    {
      unique: true,
      name: 'likes_user_event_unique',
      fields: ['user_id', 'event_id']
    }
  ]
})

module.exports = Like 