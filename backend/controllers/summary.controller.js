require('dotenv').config()
const redis = require('../redis')
const service = require('../services/summary.service')

// exports.getOverviewMetrics = async (req, res, next) => {
//     try {
//         const { end } = req.parsedQuery
//         const data = await service.getOverviewMetrics(end)
//         res.status(200).json({
//             success: true,
//             data
//         })
//     } catch (error) {
//         next(error)
//     }
// }

exports.getOverviewMetricsByDay = async (req, res, next) => {
    const { websiteUid, end } = req.parsedQuery
    try {
        const cacheKey = `overview:${websiteUid}:${end}`

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
        const data = await service.getOverviewMetricsByDay(websiteUid, end)
        await redis.set(cacheKey, JSON.stringify(data), { EX: process.env.DEFULT_EXPIRATION_TIME })

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}