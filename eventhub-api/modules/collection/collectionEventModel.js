const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const CollectionEvent = sequelize.define('CollectionEvent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  collectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'collections', key: 'id' }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'events', key: 'id' }
  }
}, {
  tableName: 'collection_events',
  timestamps: true,
  indexes: [
    // único composto: sem repetir o evento na coleção + "eventos desta coleção"
    { unique: true, name: 'idx_unique_collection_event', fields: ['collection_id', 'event_id'] },
    // simples: "em quais coleções este evento está?" e a exclusão do evento
    { name: 'idx_collection_events_event', fields: ['event_id'] }
  ]
})

module.exports = CollectionEvent