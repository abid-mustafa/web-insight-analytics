const service = require('../services/ecommerce.service')

exports.getItemCountByName = async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const data = await service.getItemCountByName(websiteUid, offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}