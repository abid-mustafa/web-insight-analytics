const visitorsService = require('../services/visitors.service')

exports.getVisitorsByCountry = async (req, res, next) => {
    try {
        const { offset, start, end } = req.parsedQuery
        const data = await visitorsService.getVisitorsByCountry(offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}