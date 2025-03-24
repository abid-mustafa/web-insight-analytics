const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT

const db = require('./config/database')

const app = express()
app.use(bodyParser.json())

app.use(
    cors({
        origin: '*',
        methods: 'GET, PUT, PATCH, POST, DELETE',
        credentials: true,
    })
)

const eventsRoutes = require('./controllers/events.controller')
app.use('/api/events/', eventsRoutes)


db.authenticate()
    .then(app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`)))
    .catch((err) => console.error('Database sync error:', err))