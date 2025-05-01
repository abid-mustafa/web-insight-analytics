const express = require('express')
const router = express.Router()
const controller = require('../controllers/events.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')

router.get('/by-name', validateDateRange, controller.getCountByName)

module.exports = router