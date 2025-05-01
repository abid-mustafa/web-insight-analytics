const express = require('express')
const router = express.Router()
const controller = require('../controllers/websites.controller')

router.get('/by-userid/:userid', controller.getWebsitesByUserid)

module.exports = router