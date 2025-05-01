const express = require('express')
const router = express.Router()
const controller = require('../controllers/ecommerce.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')

router.get('/by-name', validateDateRange, controller.getItemCountByName)

module.exports = router