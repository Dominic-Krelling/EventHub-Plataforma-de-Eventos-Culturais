const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const { VALIDATION } = require('../../config/constants')

const Comment = sequelize.define('Comment', {
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
  },
  content: {
    type: DataTypes.STRING(VALIDATION.COMMENT_MAX),
    allowNull: false
  }
})

module.exports = Comment