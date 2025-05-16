const db = require('../database')

exports.getTrafficGrouped = async (websiteId, groupBy, groupByColumn, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            ${groupByColumn} AS \`${groupBy}\`, COUNT(DISTINCT t.session_id) AS sessions
        FROM traffic_sources t
        JOIN sessions s ON t.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY ${groupBy}
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ${groupByColumn}) AS total
        FROM traffic_sources t
        JOIN sessions s ON t.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}