require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const path = require('path')

const PORT = process.env.SERVER_PORT || 5000

const db = require('./database.js')

const app = express()

const { getRealtimeData, getRealtimeInitial } = require('./utils/realtimeDataHandler.util.js')

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

const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:5500',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:5500'
]

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('CORS policy violation'))
            }
        },
        methods: 'GET, POST',
        // TODO: change to true later
        credentials: true,
    })
)

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    //  TODO: change to true later 
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 1800000 }
}))

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

app.get('/api/realtime/:event/:websiteUid', async (req, res, next) => {
    const { event, websiteUid } = req.params
    if (!['live_sessions', 'live_pageviews', 'live_events', 'live_visitors'].includes(event) || !websiteUid) {
        return next({ error: 'Invalid event type or missing website UID' })
    }
    const data = await getRealtimeInitial(`${event}`, websiteUid)()
    res.status(200).json(data)
})

const authRoutes = require('./routes/auth.routes.js')
app.use('/api/auth/', authRoutes)

// Authentication Middleware
const authMiddleware = require('./middlewares/auth.middleware.js')
app.use(authMiddleware)

const sessionsRoutes = require('./routes/sessions.routes.js')
app.use('/api/sessions/', sessionsRoutes)

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

const aiRouter = require('./routes/ai.routes.js')
app.use('/api/ai', aiRouter)

// global error handler
const errorHandler = require('./middlewares/errorHandler')
app.use(errorHandler)

io.on('connection', async (socket) => {
    console.log('a user connected')

    socket.on('track_session', async (websiteUid) => {
        getRealtimeData('live_sessions', io, websiteUid)()
    })

    socket.on('track_pageview', (websiteUid) => {
        getRealtimeData('live_pageviews', io, websiteUid)()
    })

    socket.on('track_event', (websiteUid) => {
        console.log('track_event', websiteUid);

        getRealtimeData('live_events', io, websiteUid)()
    })

    socket.on('track_visitor', (websiteUid) => {
        getRealtimeData('live_visitors', io, websiteUid)()
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

db.getConnection()
    .then(() => {
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`MySQL connected\nServer started on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Database sync error:', err)
    })
