const pagesService = require('../services/pages.service')

exports.getViewsByTitle = async (req, res, next) => {
    try {
        const { offset, start, end } = req.parsedQuery
        const data = await pagesService.getViewsByTitle(offset,
            start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}