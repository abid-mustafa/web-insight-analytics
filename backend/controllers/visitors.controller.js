const express = require('express')
const router = express.Router()
const visitorsService = require('../services/visitors.service')
const { isValid, parseISO } = require('date-fns')

router.get('/visitors-by-country', async (req, res, next) => {
    try {
        let { offset, start_date, end_date } = req.query

        offset = parseInt(offset) || 0

        let start = parseISO(start_date)
        let end = parseISO(end_date)

        if (!isValid(start) || !isValid(end) || start > end) {
            return res.status(400).json({ message: "Invalid or missing start_date and end_date" })
        }

        const users = await visitorsService.getVisitorsByCountry(offset,
            start, end)
        res.status(200).send({
            data: users,
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router