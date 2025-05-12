const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/events.service');

exports.getEventsGrouped = getGroupedData(service.getEventsGrouped);