const db = require('../database')

exports.getSessionsBySource = async (offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            source,
            COUNT(DISTINCT(session_id)) AS sessions
        FROM
            traffic_sources
        WHERE created_at BETWEEN ? AND ?
        GROUP BY source
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
            SELECT COUNT(DISTINCT(source)) AS total
            FROM traffic_sources
            WHERE created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { values, total }
}

exports.getSessionsByMedium = async (offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            medium, COUNT(DISTINCT(session_id)) AS sessions
        FROM
            traffic_sources
        WHERE created_at BETWEEN ? AND ?
        GROUP BY medium
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
            SELECT COUNT(DISTINCT(medium)) AS total
            FROM sessions
            WHERE created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { values, total }
}

exports.getSessionsByCampaign = async (offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            campaign, COUNT(DISTINCT(session_id)) AS sessions
        FROM
            traffic_sources
        WHERE created_at BETWEEN ? AND ?
        GROUP BY campaign
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
            SELECT COUNT(DISTINCT(campaign)) AS total
            FROM sessions
            WHERE created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { values, total }
}