require('dotenv').config()
const redis = require('../redis')

module.exports.getSimpleData = (cachePrefix, serviceMethod) => async (req, res, next) => {
    try {
        const { startDate, endDate } = req.parsedQuery
        const websiteUid = req.websiteUid
        const websiteId = req.websiteId
        const cacheKey = `${cachePrefix}:${websiteUid}:${startDate}:${endDate}`

        const cached = await redis.get(cacheKey)
        if (cached) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cached),
                cached: true
            })
        }

        const data = await serviceMethod(websiteId, startDate, endDate)

        await redis.set(cacheKey, JSON.stringify(data), { EX: process.env.DEFAULT_EXPIRATION_TIME || 3600 })

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.error(`Error in ${cachePrefix} request handler:`, error)
        next(error)
    }
}
