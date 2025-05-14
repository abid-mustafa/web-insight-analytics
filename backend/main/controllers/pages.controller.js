require('dotenv').config()

const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/pages.service');
const { getSimpleData } = require('../utils/simpleRequestHandler.util');
const { getPaginationData } = require('../utils/generalPaginationRequestHandler');

exports.getPagesGrouped = getGroupedData('pages-grouped', service.getPagesGrouped)
exports.getUniquePageViews = getSimpleData('unique-page-views', service.getUniquePageViews,)
exports.getAvgPageViewsPerSession = getSimpleData('avg-page-views-per-session', service.getAvgViewsPerSession)
exports.getAvgTimeOnPage = getSimpleData('avg-time-on-page', service.getAvgTimeOnPage)
exports.getTopLandingPages = getPaginationData('top-landing-pages', service.getTopLandingPages)
exports.getTopExitPages = getPaginationData('top-exit-pages', service.getTopExitPages)
exports.getBounceRateByTitle = getPaginationData('bounce-rate-by-title', service.getBounceRateByTitle)
exports.getBounceRate = getSimpleData('bounce-rate', service.getBounceRate)