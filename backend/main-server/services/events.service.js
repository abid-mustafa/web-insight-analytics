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

exports.getEventConversionRate = async (websiteId, startDate, endDate) => {
    const [[{ value }]] = await db.query(`
        SELECT 
        ROUND(100 * COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN e.session_id END) 
                / COUNT(DISTINCT e.session_id), 2) AS value
        FROM events e
        JOIN sessions s ON e.session_id = s.id
        WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return value
}

exports.eventsByCountry = async (websiteId, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            s.country AS country, COUNT(*) as event_count
        FROM events e
        JOIN sessions s ON e.session_id = s.id
        WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?
        GROUP BY s.country
        ORDER BY event_count DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(*) AS total
        FROM (
            SELECT s.country
            FROM events e
            JOIN sessions s ON e.session_id = s.id
            WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?
            GROUP BY s.country
        ) AS grouped;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.eventsByBrowser = async (websiteId, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            s.browser AS browser, COUNT(*) as event_count
        FROM events e
        JOIN sessions s ON e.session_id = s.id
        WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?
        GROUP BY s.browser
        ORDER BY event_count DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(*) AS total
        FROM (
            SELECT s.browser
            FROM events e
            JOIN sessions s ON e.session_id = s.id
            WHERE s.website_id = ? AND e.created_at BETWEEN ? AND ?
            GROUP BY s.browser
        ) AS grouped;
    `, [websiteId, startDate, endDate])

    return { values, total }
}