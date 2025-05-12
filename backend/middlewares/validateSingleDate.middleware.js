const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRangeSingle(req, res, next) {
    const { endDate } = req.query

    if (!endDate) {
        const error = new Error("Missing endDate")
        error.status = 400
        return next(error)
    }

    const end = parseISO(endDate)

    if (!isValid(end)) {
        const error = new Error("Invalid endDate")
        error.statusCode = 400
        return next(error)
    }

    req.endDate = end

    next()
}