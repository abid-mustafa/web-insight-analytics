const express = require('express')
const router = express.Router()
const controller = require('../controllers/pages.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')

router.get('/grouped', validateDateRange, validateGroupBy('pages'), controller.getPagesGrouped)

module.exports = router