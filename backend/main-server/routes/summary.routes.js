const express = require('express')
const router = express.Router()
const controller = require('../controllers/summary.controller')
const validateSingleDate = require('../middlewares/validateSingleDate.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

// router.get('/totals', validateSingleDate, controller.getOverviewMetricsByDay)
router.get('/by-day', websiteIdMiddleware, validateSingleDate, controller.getOverviewMetricsByDay)

module.exports = router