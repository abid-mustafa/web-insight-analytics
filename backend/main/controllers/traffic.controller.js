const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/traffic.service');

exports.getTrafficGrouped = getGroupedData(service.getTrafficGrouped);