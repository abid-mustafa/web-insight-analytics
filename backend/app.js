require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const path = require('path')

const PORT = process.env.SERVER_PORT

const db = require('./database.js')

const app = express()

// SockerIO configuration
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

app.use(bodyParser.json())

app.use(
    cors({
        // origin: 'http://localhost:4200',
        origin: '*',
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

// Serve static files from the "public" directory
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

const authRoutes = require('./routes/auth.routes.js')
app.use('/api/auth/', authRoutes)

// Authentication Middleware
const authMiddleware = require('./middlewares/auth.middleware.js')
app.use(authMiddleware)

const eventsRoutes = require('./routes/events.routes.js')
app.use('/api/events/', eventsRoutes)

const pagesRoutes = require('./routes/pages.routes.js')
app.use('/api/pages/', pagesRoutes)

const visitorsRoutes = require('./routes/visitors.routes.js')
app.use('/api/visitors/', visitorsRoutes)

const ecommerceRoutes = require('./routes/ecommerce.routes.js')
app.use('/api/ecommerce/', ecommerceRoutes)

const trafficRouter = require('./routes/traffic.routes.js')
app.use('/api/traffic/', trafficRouter)

const summaryRouter = require('./routes/summary.routes.js')
app.use('/api/summary', summaryRouter)

const websitesRouter = require('./routes/websites.routes.js')
app.use('/api/websites', websitesRouter)

// global error handler
const errorHandler = require('./middlewares/errorHandler')
app.use(errorHandler)

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('track_pageview', (data) => {
        console.log(`message:  + ${JSON.stringify(data)}`)
        io.emit('get_pageview', data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

db.getConnection()
    .then(() => {
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server started on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Database sync error:', err)
    })
