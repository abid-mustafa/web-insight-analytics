const { getGroupedData } = require('../utils/groupedRequestHandler.util')
const { getSimpleData } = require('../utils/simpleRequestHandler.util')
const { getPaginationData } = require('../utils/generalPaginationRequestHandler.util')
const service = require('../services/events.service')

exports.getEventsGrouped = getGroupedData('events-grouped', service.getEventsGrouped)
exports.getEventConversionRate = getSimpleData('event-conversion-rate', service.getEventConversionRate)
exports.getEventsByCountry = getPaginationData('events-by-country', service.eventsByCountry)
exports.getEventsByBrowser = getPaginationData('events-by-device', service.eventsByBrowser)