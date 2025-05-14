const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/events.service');

exports.getEventsGrouped = getGroupedData('events-grouped', service.getEventsGrouped);