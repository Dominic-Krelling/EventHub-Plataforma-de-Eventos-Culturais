const path = require('path')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')

require('dotenv').config()

const sequelize = require('./config/database')
const setupAssociations = require('./config/associations')

const indexRouter = require('./routes/index')
const searchRoutes = require('./modules/search/searchRoutes')
const userRoutes = require('./modules/user/userRoutes')
const eventRoutes = require('./modules/event/eventRoutes')
const feedRoutes = require('./modules/event/feedRoutes')

const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(logger('dev'))

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public/uploads'))
)

app.use('/api', indexRouter)
app.use('/api/events', eventRoutes)
app.use('/api/feed', feedRoutes)
app.use('/api', searchRoutes)
app.use('/api', userRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.',
    errors: []
  })
})

app.use(errorHandler)

setupAssociations()

sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado!')
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco:', error)
  })

module.exports = app
