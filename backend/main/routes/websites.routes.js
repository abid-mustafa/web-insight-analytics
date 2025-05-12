const express = require('express')
const router = express.Router()
const controller = require('../controllers/websites.controller')

router.get('/', controller.getWebsitesByUserid)
router.post('/', controller.addWebsite)

module.exports = router