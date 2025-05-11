const express = require('express')
const router = express.Router()
const controller = require('../controllers/ecommerce.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')

router.get('/items/grouped', validateDateRange, validateGroupBy('items'), controller.getItemsGrouped)

module.exports = router