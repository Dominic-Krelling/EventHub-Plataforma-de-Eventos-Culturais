
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')

require('dotenv').config()

const indexRouter = require('./routes/index')
const searchRoutes = require('./modules/search/searchRoutes')
const userRoutes = require('./modules/user/userRoutes')
const eventRoutes = require('./modules/event/eventRoutes')

const errorHandler = require('./middlewares/errorHandler')
const setupAssociations = require('./config/associations')
const sequelize = require('./config/database')

const app = express()

// Middlewares globais
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

// Arquivos públicos: fotos de perfil e imagens dos eventos
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public', 'uploads'))
)

// Rotas
app.use('/api', indexRouter)
app.use('/api/events', eventRoutes)
app.use('/api', searchRoutes)
app.use('/api', userRoutes)

// Resposta 404
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Rota não encontrada.',
    errors: []
  })
})

// Tratamento de erros
app.use(errorHandler)

// Associações antes da sincronização
setupAssociations()

sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado!')
  })
  .catch((err) => {
    console.error('Erro ao sincronizar banco:', err)
  })

module.exports = app
