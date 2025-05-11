const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/visitors.service');

exports.getVisitorsGrouped = getGroupedData(service.getVisitorsGrouped);