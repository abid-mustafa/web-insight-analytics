const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/pages.service');

exports.getPagesGrouped = getGroupedData(service.getPagesGrouped);