module.exports.getGroupedData = (serviceMethod) => async (req, res, next) => {
    try {
        const { websiteUid, offset, start, end } = req.parsedQuery
        const groupByColumn = req.groupByColumn
        const groupBy = req.groupBy

        const data = await serviceMethod(websiteUid, groupBy, groupByColumn, offset, start, end)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}
