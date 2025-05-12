const express = require('express')
const router = express.Router()
const controller = require('../controllers/visitors.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

router.get('/grouped', websiteIdMiddleware, validateDateRange, validateGroupBy('sessions'), controller.getVisitorsGrouped)

module.exports = router