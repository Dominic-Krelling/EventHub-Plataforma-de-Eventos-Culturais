const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const { VALIDATION } = require('../../config/constants')

const Collection = sequelize.define('Collection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(VALIDATION.COLLECTION_TITLE_MAX), allowNull: false },
  description: { type: DataTypes.STRING(VALIDATION.COLLECTION_DESCRIPTION_MAX), allowNull: true },
  // Privada por padrão
  isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  // Contador desnormalizado: quem mexe na junção atualiza aqui, na mesma transação
  eventsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'collections',
  timestamps: true,
  indexes: [{ name: 'collections_user_idx', fields: ['user_id'] }]
})

module.exports = Collection