const express = require('express')
const router = express.Router()
const controller = require('../controllers/visitors.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')

router.get('/grouped', validateDateRange, validateGroupBy('sessions'), controller.getVisitorsGrouped)

module.exports = router