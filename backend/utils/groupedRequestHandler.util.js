require('dotenv').config()
const redis = require('../redis')

module.exports.getGroupedData = (serviceMethod) => async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const groupByColumn = req.groupByColumn
        const groupBy = req.groupBy

        const cacheKey = `grouped:${websiteUid}:${groupBy}:${offset}:${start}:${end}`

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
        const data = await serviceMethod(websiteUid, groupBy, groupByColumn, offset, start, end)
        await redis.set(cacheKey, JSON.stringify(data), { EX: process.env.DEFULT_EXPIRATION_TIME })

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}
