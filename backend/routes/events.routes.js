const express = require('express')
const router = express.Router()
const controller = require('../controllers/events.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')

router.get('/grouped', validateDateRange, validateGroupBy('events'), controller.getEventsGrouped)

module.exports = router