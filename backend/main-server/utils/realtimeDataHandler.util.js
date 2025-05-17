require('dotenv').config()
const redis = require('../redis')

module.exports.getRealtimeData = (cachePrefix, io, websiteUid) => async () => {
    const cacheKey = `${cachePrefix}:${websiteUid}`

    const cached = parseInt(await redis.get(cacheKey) || '0', 10)
    const newCount = cached + 1
    console.log(cachePrefix, newCount);

    await redis.set(cacheKey, JSON.stringify(newCount), { EX: process.env.DEFAULT_EXPIRATION_TIME || 3600 })

    io.emit(cachePrefix, newCount)
}

module.exports.getRealtimeInitial = (cachePrefix, websiteUid) => async () => {
    const cacheKey = `${cachePrefix}:${websiteUid}`
    const value = parseInt(await redis.get(cacheKey) || '0', 10)
    console.log(`cacheKey: ${cacheKey}, value: ${value}`);

    return { value }
}