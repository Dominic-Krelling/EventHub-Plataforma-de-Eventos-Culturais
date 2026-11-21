const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const { NOTIFICATION } = require('../../config/constants')

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  actorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  type: { type: DataTypes.ENUM(...Object.values(NOTIFICATION.TYPES)), allowNull: false },
  eventId: { type: DataTypes.INTEGER, allowNull: true },
  isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, 
{
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { name: 'notifications_user_read_idx', fields: ['user_id', 'is_read'] },
    { name: 'notifications_event_idx', fields: ['event_id'] }
  ]
})

module.exports = Notification