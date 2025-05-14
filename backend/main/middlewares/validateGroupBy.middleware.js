const allowedGroupBys = {
    'sessions': { 'country': 's.country', 'city': 's.city', 'device': 's.device', 'os': 's.os', 'browser': 's.browser', 'date': 's.created_at' },
    'pages': { 'title': 'p.page_title', 'url': 'p.page_url', 'referrer': 'p.referrer', 'date': 'p.created_at' },
    'events': { 'name': 'e.event_name', 'url': 'e.page_url', 'date': 'e.created_at' },
    'traffic': { 'source': 't.source', 'medium': 't.medium', 'campaign': 't.campaign', 'date': 't.created_at' },
    'items': { 'category': 'i.item_category', 'name': 'i.item_name', 'id': 'i.item_id', 'date': 'i.created_at' },
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
