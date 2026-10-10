const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  viewsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'events',
  timestamps: true
})

module.exports = Event
