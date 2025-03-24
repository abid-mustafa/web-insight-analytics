const express = require('express')
const router = express.Router()
const eventsService = require('../services/events.service')

router.get('/count-by-name', async (req, res) => {
    try {
        const { offset, start_date: startDate, end_date: endDate } = req.query

        if (!offset || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required parameters" })
        }

        const events = await eventsService.countByName(parseInt(offset),
            startDate, endDate)
        res.status(200).send({ data: events })
    } catch (error) {
        console.log('An error occured while getting events count by name', error)
        res.status(500).send({ message: "Oops! An error occured" })
    }
})

module.exports = router