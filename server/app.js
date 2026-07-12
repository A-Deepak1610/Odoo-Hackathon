const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')

const apiRoutes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
  })
})

app.use('/api', apiRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use(errorHandler)

module.exports = app
