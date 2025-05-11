const express = require('express')
const router = express.Router()
const controller = require('../controllers/traffic.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')

router.get('/grouped', validateDateRange, validateGroupBy('traffic'), controller.getTrafficGrouped)

module.exports = router