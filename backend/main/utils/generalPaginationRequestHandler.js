require('dotenv').config()
const redis = require('../redis')

module.exports.getPaginationData = (cachePrefix, serviceMethod) => async (req, res, next) => {
    try {
        const { offset, startDate, endDate } = req.parsedQuery
        const websiteUid = req.websiteUid
        const websiteId = req.websiteId

        const cacheKey = `${cachePrefix}:${websiteUid}:${offset}:${startDate}:${endDate}`

        // Check Redis cache
        const cached = await redis.get(cacheKey)
        if (cached) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cached),
                cached: true
            })
        }

        // If not cached, fetch and cache
        const data = await serviceMethod(websiteId, offset, startDate, endDate)
        await redis.set(cacheKey, JSON.stringify(data), { EX: process.env.DEFAULT_EXPIRATION_TIME || 3600 })

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Error fetching grouped data:', error)
        next(error)
    }
}
