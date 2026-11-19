const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

// Relação usuário ↔ usuário: followerId segue followingId.
const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'follows',
  indexes: [
    // Garante "uma pessoa segue a outra só uma vez" e atende buscas por follower_id
    // (a coluna mais à esquerda do índice composto).
    {
      unique: true,
      name: 'follows_follower_following_unique',
      fields: ['follower_id', 'following_id']
    },
    // O índice composto não ajuda quando a busca é só por following_id
    // (listar seguidores de alguém), por isso o segundo índice.
    {
      name: 'follows_following_idx',
      fields: ['following_id']
    }
  ]
})

module.exports = Follow