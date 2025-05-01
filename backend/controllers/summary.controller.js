const summaryService = require('../services/summary.service')
const { isValid, parseISO } = require('date-fns')

exports.getOverviewMetrics = async (req, res, next) => {
    try {
        const { end } = req.parsedQuery
        const data = await summaryService.getOverviewMetrics(end)
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
        const data = await summaryService.getOverviewMetricsByDay(end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}