const express = require('express')
const router = express.Router()
const controller = require('../controllers/ecommerce.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

router.get('/items/grouped', websiteIdMiddleware, validateDateRange, validateGroupBy('items'), controller.getItemsGrouped)

module.exports = router