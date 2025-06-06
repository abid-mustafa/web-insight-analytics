const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRangeSingle(req, res, next) {
    const { endDate } = req.query

    if (!endDate) {
        const error = new Error("Missing endDate")
        error.statusCode = 400
        return next(error)
    }

    const end = parseISO(endDate)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)

    if (!isValid(end)) {
        const error = new Error("Invalid endDate")
        error.statusCode = 400
        return next(error)
    }

    req.endDate = end.toISOString()
    req.startDate = start.toISOString()

    next()
}