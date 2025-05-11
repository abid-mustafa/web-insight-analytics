const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRange(req, res, next) {
    const { website_uid, end_date } = req.query

    if (!website_uid || !end_date) {
        const error = new Error("Missing website_uid or end_date")
        error.status = 400
        return next(error)
    }

    const end = parseISO(end_date)

    if (!isValid(end)) {
        const error = new Error("Invalid end_date")
        error.status = 400
        return next(error)
    }

    req.parsedQuery = {
        websiteUid: website_uid || 1,
        end
    }

    next()
}