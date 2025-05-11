const service = require('../services/traffic.service')

exports.getSessionsBySource = async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const data = await service.getSessionsBySource(websiteUid, offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}