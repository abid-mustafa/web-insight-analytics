const express = require('express')
const router = express.Router()
const controller = require('../controllers/visitors.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')

router.get('/by-country', validateDateRange, controller.getVisitorsByCountry)

module.exports = router