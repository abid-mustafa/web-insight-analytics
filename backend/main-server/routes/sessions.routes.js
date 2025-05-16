const express = require('express')
const router = express.Router()
const controller = require('../controllers/sessions.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')

router.get('/grouped', websiteIdMiddleware, validateDateRange, validateGroupBy('sessions'), controller.getSessionsGrouped)
router.get('/new-vs-returning-sessions', websiteIdMiddleware, validateDateRange, controller.newVsReturningSessions)
router.get('/by-source', websiteIdMiddleware, validateDateRange, controller.sessionsByTrafficSource)
router.get('/conversion-rate', websiteIdMiddleware, validateDateRange, controller.sessionConversionRate)

module.exports = router