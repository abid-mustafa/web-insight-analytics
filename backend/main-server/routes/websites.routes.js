const express = require('express')
const router = express.Router()
const controller = require('../controllers/websites.controller')

router.get('/', controller.getWebsitesByUserid)
router.post('/', controller.addWebsite)
router.put('/', controller.updateWebsite)
router.delete('/', controller.deleteWebsite)

module.exports = router