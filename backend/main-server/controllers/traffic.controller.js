const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/traffic.service');

exports.getTrafficGrouped = getGroupedData('traffic-grouped', service.getTrafficGrouped);