const db = require('../database')

module.exports.getSessionsBySource = async (offset, startDate, endDate) => {
    const dbConnection = await db.getConnection()

    const [result] = await dbConnection.query(`
        SELECT 
            source, COUNT(DISTINCT(session_id)) AS sessions
        FROM
            traffic_sources
        WHERE created_at BETWEEN ? AND ?
        GROUP BY source
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    return result
}

module.exports.getSessionsByMedium = async (offset, startDate, endDate) => {
    const dbConnection = await db.getConnection()

    const [result] = await dbConnection.query(`
        SELECT 
            medium, COUNT(DISTINCT(session_id)) AS sessions
        FROM
            traffic_sources
        WHERE created_at BETWEEN ? AND ?
        GROUP BY medium
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    return result
}

module.exports.getSessionsByCampaign = async (offset, startDate, endDate) => {
    const dbConnection = await db.getConnection()

    const [result] = await dbConnection.query(`
        SELECT 
            campaign, COUNT(DISTINCT(session_id)) AS sessions
        FROM
            traffic_sources
        WHERE created_at BETWEEN ? AND ?
        GROUP BY campaign
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    return result
}