const express = require('express')
const router = express.Router()
const trafficService = require('../services/traffic.service')
const { isValid, parseISO } = require('date-fns')

router.get('/sessions-by-source', async (req, res, next) => {
    try {
        let { offset, start_date, end_date } = req.query

        offset = parseInt(offset) || 0

        const start = parseISO(start_date)
        const end = parseISO(end_date)

        if (!isValid(start) || !isValid(end) || start > end) {
            const error = new Error("Invalid or missing start_date and end_date")
            error.status = 400
            return next(error)
        }

        const data = await trafficService.getSessionsBySource(offset,
            start, end)
        res.status(200).send({
            data
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router