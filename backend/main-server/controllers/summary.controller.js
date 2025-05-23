require('dotenv').config()
const redis = require('../redis')
const service = require('../services/summary.service')

// exports.getOverviewMetrics = async (req, res, next) => {
//     try {
//         const { endDate } = req.parsedQuery
//         const data = await service.getOverviewMetrics(endDate)
//         res.status(200).json({
//             success: true,
//             data
//         })
//     } catch (error) {
//         next(error)
//     }
// }

exports.getOverviewMetricsByDay = async (req, res, next) => {
    const endDate = req.endDate
    const startDate = req.startDate
    const websiteUid = req.websiteUid
    const websiteId = parseInt(req.websiteId)

    try {
        const cacheKey = `overview:${websiteUid}:${endDate}`

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
        const data = await service.getOverviewMetricsByDay(websiteId, startDate, endDate)
        await redis.set(cacheKey, JSON.stringify(data), { EX: process.env.DEFULT_EXPIRATION_TIME || 3600 })

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}