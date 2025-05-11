const service = require('../services/events.service')

exports.getCountByName = async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const data = await service.getCountByName(websiteUid, offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}