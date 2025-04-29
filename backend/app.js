const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT

const db = require('./database.js')

const app = express()
app.use(bodyParser.json())

app.use(
    cors({
        origin: 'http://localhost:4200',
        methods: 'GET, PUT, PATCH, POST, DELETE',
        // credentials: true,  TODO: change to true later 
        credentials: false
    })
)

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

const eventsRoutes = require('./controllers/events.controller')
app.use('/api/events/', eventsRoutes)

const pagesRoutes = require('./controllers/pages.controller')
app.use('/api/pages/', pagesRoutes)

const usersRoutes = require('./controllers/users.controller')
app.use('/api/users/', usersRoutes)

const ecommerceRoutes = require('./controllers/ecommerce.controller.js')
app.use('/api/ecommerce/', ecommerceRoutes)

const trafficRouter = require('./controllers/traffic.controller.js')
app.use('/api/traffic/', trafficRouter)

const summaryRouter = require('./controllers/summary.controller.js')
app.use('/api/summary', summaryRouter)

app.use((err, req, res, next) => {
    const error = {
        statusCode: err.statusCode || 500,
        message: err.message
    }
    console.error(error)
    res.status(error.statusCode).send('Something broke!')
})

db.getConnection()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server started on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Database sync error:', err)
    })
