const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const { REPORT } = require('../../config/constants')

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  eventId: { type: DataTypes.INTEGER, allowNull: false },
  reason: { type: DataTypes.ENUM(...Object.values(REPORT.REASONS)), allowNull: false }
}, {
  tableName: 'reports',
  timestamps: true,
  indexes: [
    { unique: true, name: 'idx_unique_report_user_event', fields: ['user_id', 'event_id'] },
    { name: 'reports_event_idx', fields: ['event_id'] }
  ]
})

module.exports = Report