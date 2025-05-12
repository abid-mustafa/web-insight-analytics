require('dotenv').config()
const { createClient } = require('redis')

const redisClient = createClient({ url: process.env.REDIS_URL })
redisClient.connect()

redisClient.on('error', err => {
    console.error('Redis Client Error', err)
})

redisClient.on('ready', () => {
    console.log('Redis connected')
})

module.exports = redisClient