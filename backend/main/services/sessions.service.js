const db = require('../database')

exports.getSessionsGrouped = async (websiteId, groupBy, groupByColumn, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            ${groupByColumn} AS ${groupBy}, COUNT(*) as sessions_count
        FROM sessions s
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY ${groupBy}
        ORDER BY ${groupByColumn} DESC
        LIMIT 5 OFFSET ?; 
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ${groupByColumn}) AS total
        FROM sessions s
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.newVsReturningSessions = async (websiteId, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            v.is_new_visitor AS is_new,
            COUNT(*) AS session_count
        FROM sessions s
        JOIN visitors v ON s.visitor_id = v.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY v.is_new_visitor;
    `, [websiteId, startDate, endDate])

    return values;
}

exports.sessionsByTrafficSource = async (websiteId, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            ts.source AS source,
            COUNT(*) AS session_count
        FROM sessions s
        JOIN traffic_sources ts ON s.id = ts.session_id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY ts.source
        ORDER BY session_count DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(*) AS total
        FROM (
            SELECT ts.source
            FROM sessions s
            JOIN traffic_sources ts ON s.id = ts.session_id
            WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
            GROUP BY ts.source
        ) AS grouped;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.sessionConversionRate = async (websiteId, startDate, endDate) => {
    const [[{ total_sessions }]] = await db.query(`
        SELECT COUNT(*) AS total_sessions
        FROM sessions
        WHERE website_id = ? AND created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    const [[{ converted_sessions }]] = await db.query(`
        SELECT COUNT(DISTINCT s.id) AS converted_sessions
        FROM sessions s
        JOIN transactions t ON s.id = t.session_id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    const rate = total_sessions > 0 ? (converted_sessions / total_sessions) * 100 : 0
    return { conversion_rate_percentage: rate }
}