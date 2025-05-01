const dotenv = require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const session = require('express-session')

const PORT = process.env.SERVER_PORT

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

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true } TODO: change to true later 
    cookie: { secure: false }
}))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

const authRoutes = require('./controllers/auth.controller.js')
app.use('/api/auth/', authRoutes)

// Authentication Middleware
app.use((req, res, next) => {
    if (req.session.user) {
        return next()
    }
    res.status(401).json({ message: 'Not authenticated' })
})

const eventsRoutes = require('./controllers/events.controller')
app.use('/api/events/', eventsRoutes)

const pagesRoutes = require('./controllers/pages.controller')
app.use('/api/pages/', pagesRoutes)

const visitorsRoutes = require('./controllers/visitors.controller.js')
app.use('/api/visitors/', visitorsRoutes)

const ecommerceRoutes = require('./controllers/ecommerce.controller.js')
app.use('/api/ecommerce/', ecommerceRoutes)

const trafficRouter = require('./controllers/traffic.controller.js')
app.use('/api/traffic/', trafficRouter)

const summaryRouter = require('./controllers/summary.controller.js')
app.use('/api/summary', summaryRouter)

const websitesRouter = require('./controllers/websites.controller.js')
app.use('/api/websites', websitesRouter)

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
