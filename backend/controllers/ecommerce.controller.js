const ecommerceService = require('../services/ecommerce.service')

exports.getItemCountByName = async (req, res, next) => {
    try {
        const { offset, start, end } = req.parsedQuery
        const data = await ecommerceService.getItemCountByName(offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}