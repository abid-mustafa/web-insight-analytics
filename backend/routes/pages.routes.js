const express = require('express')
const router = express.Router()
const controller = require('../controllers/pages.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')

router.get('/by-title', validateDateRange, controller.getViewsByTitle)

module.exports = router