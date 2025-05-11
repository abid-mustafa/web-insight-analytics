const service = require('../services/visitors.service')

exports.getVisitorsByCountry = async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const data = await service.getVisitorsByCountry(websiteUid, offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}