const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRange(req, res, next) {
    const { offset, startDate, endDate } = req.query

    if (!startDate || !endDate) {
        const error = new Error("Missing startDate or endDate")
        error.statusCode = 400
        return next(error)
    }

    const start = parseISO(startDate)
    const end = parseISO(endDate)

    if (!isValid(start) || !isValid(end) || start > end) {
        const error = new Error("Invalid startDate or endDate")
        error.statusCode = 400
        return next(error)
    }

    const parsedOffset = parseInt(offset, 10)
    const finalOffset = Number.isNaN(parsedOffset) ? 0 : parsedOffset

    req.parsedQuery = {
        offset: finalOffset,
        startDate: start.toISOString(),
        endDate: end.toISOString()
    }

    return next()
}