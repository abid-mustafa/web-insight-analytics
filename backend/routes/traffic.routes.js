const express = require('express')
const router = express.Router()
const controller = require('../controllers/traffic.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')

router.get('/by-source', validateDateRange, controller.getSessionsBySource)

module.exports = router