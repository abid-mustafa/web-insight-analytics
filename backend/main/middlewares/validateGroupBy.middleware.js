const allowedGroupBys = {
    'sessions': { 'country': 's.country', 'city': 's.city', 'device': 's.device', 'os': 's.os', 'browser': 's.browser' },
    'pages': { 'title': 'p.page_title', 'url': 'p.page_url', 'referrer': 'p.referrer' },
    'events': { 'name': 'e.event_name', 'url': 'e.page_url' },
    'traffic': { 'source': 't.source', 'medium': 't.medium', 'campaign': 't.campaign' },
    'items': { 'category': 'i.item_category', 'name': 'i.item_name', 'id': 'i.item_id' }
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
