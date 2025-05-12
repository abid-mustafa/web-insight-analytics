const express = require('express')
const router = express.Router()
const controller = require('../controllers/traffic.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

router.get('/grouped', websiteIdMiddleware, validateDateRange, validateGroupBy('traffic'), controller.getTrafficGrouped)

module.exports = router