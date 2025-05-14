const express = require('express')
const router = express.Router()
const controller = require('../controllers/events.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

router.get('/grouped', websiteIdMiddleware, validateDateRange, validateGroupBy('events'), controller.getEventsGrouped)
router.get('/conversion-rate', websiteIdMiddleware, validateDateRange, controller.getEventConversionRate)
router.get('/by-country', websiteIdMiddleware, validateDateRange, controller.getEventsByCountry)
router.get('/by-browser', websiteIdMiddleware, validateDateRange, controller.getEventsByBrowser)

module.exports = router