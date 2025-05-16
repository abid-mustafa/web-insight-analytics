const { getGroupedData } = require('../utils/groupedRequestHandler.util');
const service = require('../services/ecommerce.service');

exports.getItemsGrouped = getGroupedData('items-grouped', service.getItemsGrouped);