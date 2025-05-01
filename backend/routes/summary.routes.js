const express = require('express')
const router = express.Router()
const controller = require('../controllers/summary.controller')
const validateSingleDate = require('../middlewares/validateSingleDate.middleware')

router.get('/totals', validateSingleDate, controller.getOverviewMetrics)
router.get('/by-day', validateSingleDate, controller.getOverviewMetricsByDay)

module.exports = router