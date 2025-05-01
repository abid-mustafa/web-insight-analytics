const eventsService = require('../services/events.service')

exports.getCountByName = async (req, res, next) => {
    try {
        const { offset, start, end } = req.parsedQuery
        const data = await eventsService.getCountByName(offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}