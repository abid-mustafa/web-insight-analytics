const service = require('../services/sessions.service')
const { getGroupedData } = require('../utils/groupedRequestHandler.util')
const { getSimpleData } = require('../utils/simpleRequestHandler.util')
const { getPaginationData } = require('../utils/generalPaginationRequestHandler.util')

exports.getSessionsGrouped = getGroupedData('sessions-grouped', service.getSessionsGrouped)
exports.newVsReturningSessions = getSimpleData('new-vs-returning-sessions', service.newVsReturningSessions)
exports.sessionsByTrafficSource = getPaginationData('sessions-by-traffic-source', service.sessionsByTrafficSource)
exports.sessionConversionRate = getSimpleData('session-conversion-rate', service.sessionConversionRate)