const db = require('../database')

exports.getEventsGrouped = async (websiteId, groupBy, groupByColumn, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            ${groupByColumn} AS ${groupBy}, COUNT(*) as event_count
        FROM events e
        JOIN sessions s ON e.session_id = s.id
        WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?
        GROUP BY ${groupBy}
        ORDER BY ${groupByColumn} DESC
        LIMIT 5 OFFSET ?; 
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ${groupByColumn}) AS total
        FROM events e
        JOIN sessions s ON e.session_id = s.id
        WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}