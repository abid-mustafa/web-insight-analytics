const allowedGroupBys = {
    'sessions': { 'country': 's.country', 'city': 's.city', 'device': 's.device', 'os': 's.os', 'browser': 's.browser' },
    'pages': { 'page_title': 'p.page_title', 'page_url': 'p.page_url', 'referrer': 'p.referrer' },
    'events': { 'event_name': 'e.event_name', 'page_url': 'e.page_url' },
    'traffic': { 'source': 't.source', 'medium': 't.medium', 'campaign': 't.campaign' },
    'items': { 'item_category': 'i.item_category', 'item_name': 'i.item_name', 'item_id': 'i.item_id' }
}

module.exports = function validateGroupBy(endpointName) {
    return (req, res, next) => {
        const groupBy = req.query.groupBy
        const allowedFields = allowedGroupBys[endpointName]

        if (!groupBy || allowedFields && allowedFields[groupBy]) {
            req.groupBy = groupBy
            req.groupByColumn = allowedFields ? allowedFields[groupBy] : null // safe SQL reference
            return next()
        }

        const error = new Error(`Invalid groupBy for ${endpointName}`)
        error.statusCode = 400
        return next(error)
    }
}
