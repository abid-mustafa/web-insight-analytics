const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRange(req, res, next) {
    const { website_uid, offset, start_date, end_date } = req.query

    if (!website_uid || !start_date || !end_date) {
        const error = new Error("Missing website_uid or start_date or end_date")
        error.statusCode = 400
        return next(error)
    }

    const start = parseISO(start_date)
    const end = parseISO(end_date)

    if (!isValid(start) || !isValid(end) || start > end) {
        const error = new Error("Invalid start_date or end_date")
        error.statusCode = 400
        return next(error)
    }

    const parsedOffset = parseInt(offset, 10)
    const finalOffset = Number.isNaN(parsedOffset) ? 0 : parsedOffset

    req.parsedQuery = {
        websiteUid: website_uid,
        offset: finalOffset,
        start,
        end
    }

    return next()
}