const trafficService = require('../services/traffic.service')

exports.getSessionsBySource = async (req, res, next) => {
    try {
        const { offset, start, end } = req.parsedQuery
        const data = await trafficService.getSessionsBySource(offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}