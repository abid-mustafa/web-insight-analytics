const express = require('express')
const router = express.Router()
const pagesService = require('../services/pages.service')
const { isValid, parseISO } = require('date-fns');

router.get('/views-by-title', async (req, res) => {
    try {
        let { offset, start_date, end_date } = req.query;

        offset = parseInt(offset) || 0

        let start = parseISO(start_date)
        let end = parseISO(end_date)

        if (!isValid(start) || !isValid(end)) {
            return res.status(400).json({ message: "Invalid or missing start_date and end_date" })
        }

        const views = await pagesService.getViewsByTitle(offset,
            start, end)
        res.status(200).send({
            data: views,
        })
    } catch (error) {
        console.log('An error occured while getting views by title', error)
        res.status(500).send({ message: "Oops! An error occured" })
    }
})

module.exports = router