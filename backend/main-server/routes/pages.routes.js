const express = require('express')
const router = express.Router()
const controller = require('../controllers/pages.controller')
const validateDateRange = require('../middlewares/validateDateRange.middleware')
const validateGroupBy = require('../middlewares/validateGroupBy.middleware')
const websiteIdMiddleware = require('../middlewares/websiteId.middleware')

router.get('/grouped', websiteIdMiddleware, validateDateRange, validateGroupBy('pages'), controller.getPagesGrouped)
router.get('/unique-page-views', websiteIdMiddleware, validateDateRange, controller.getUniquePageViews)
router.get('/avg-page-views-per-session', websiteIdMiddleware, validateDateRange, controller.getAvgPageViewsPerSession)
router.get('/avg-time-on-page', websiteIdMiddleware, validateDateRange, controller.getAvgTimeOnPage)
router.get('/top-landing-pages', websiteIdMiddleware, validateDateRange, controller.getTopLandingPages)
router.get('/top-exit-pages', websiteIdMiddleware, validateDateRange, controller.getTopExitPages)
router.get('/bounce-rate-by-title', websiteIdMiddleware, validateDateRange, controller.getBounceRateByTitle)
router.get('/bounce-rate', websiteIdMiddleware, validateDateRange, controller.getBounceRate)

module.exports = router