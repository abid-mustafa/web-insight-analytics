const service = require('../services/pages.service')

exports.getViewsByTitle = async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const data = await service.getViewsByTitle(websiteUid, offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}