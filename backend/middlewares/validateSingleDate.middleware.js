const { isValid, parseISO } = require('date-fns')

module.exports = function validateDateRange(req, res, next) {
    const { end_date } = req.query
    console.log(end_date);


    if (!end_date) {
        const error = new Error("Missing end_date")
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
        end
    }

    next()
}