const db = require('../database')

exports.getVisitorsGrouped = async (websiteId, groupBy, groupByColumn, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            COALESCE(${groupByColumn}, 'Unknown') AS \`${groupBy}\`, COUNT(DISTINCT visitor_id) AS visitors
        FROM sessions AS s
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY COALESCE(${groupByColumn}, 'Unknown')
        ORDER BY visitors DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT COALESCE(${groupByColumn}, 'Unknown')) AS total
        FROM sessions AS s
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}