const express = require('express')
const router = express.Router()
const summaryService = require('../services/summary.service')
const { isValid, parseISO } = require('date-fns')

router.get('/overview-metrics', async (req, res, next) => {
    try {
        let { end_date } = req.query

        const end = parseISO(end_date)

        if (!isValid(end)) {
            const error = new Error("Invalid or missing end_date")
            error.status = 400
            return next(error)
        }

        const data = await summaryService.getOverviewMetrics(end)
        res.status(200).send({
            data
        })
    } catch (error) {
        next(error)
    }
})

router.get('/overview-metrics-by-day', async (req, res, next) => {
    try {
        let { end_date } = req.query

        const end = parseISO(end_date)

        if (!isValid(end)) {
            const error = new Error("Invalid or missing end_date")
            error.status = 400
            return next(error)
        }

        const data = await summaryService.getOverviewMetricsByDay(end)
        res.status(200).send({
            data
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router