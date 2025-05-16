const express = require('express')
const router = express.Router()
const controller = require('../controllers/ai.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

router.post('/search-bar', controller.getSearchBarData)
router.post('/report', controller.getAiReportData)

module.exports = router