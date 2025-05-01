const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRange(req, res, next) {
    const { start_date, end_date, offset } = req.query;

    if (!start_date || !end_date) {
        const error = new Error("Missing start_date or end_date")
        error.status = 400
        return next(error)
    }

    const start = parseISO(start_date)
    const end = parseISO(end_date)

    if (!isValid(start) || !isValid(end) || start > end) {
        const error = new Error("Invalid start_date or end_date")
        error.status = 400
        return next(error)
    }

    req.parsedQuery = {
        offset: parseInt(offset) || 0,
        start,
        end
    }

    next()
}