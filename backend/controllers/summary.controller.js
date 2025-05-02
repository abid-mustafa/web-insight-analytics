const service = require('../services/summary.service')

exports.getOverviewMetrics = async (req, res, next) => {
    try {
        const { end } = req.parsedQuery
        const data = await service.getOverviewMetrics(end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

exports.getOverviewMetricsByDay = async (req, res, next) => {
    try {
        const { end } = req.parsedQuery
        const data = await service.getOverviewMetricsByDay(end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}