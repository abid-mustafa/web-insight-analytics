const express = require('express')
const router = express.Router()
const controller = require('../controllers/tracking.controller')

router.post('/track-session', controller.trackSession)
router.post('/track-pageview', controller.trackPageview)
router.post('/track-event', controller.trackEvent)

module.exports = router