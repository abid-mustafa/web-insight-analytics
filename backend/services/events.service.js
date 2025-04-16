const db = require('../database')

module.exports.getCountByName = async (offset, startDate, endDate) => {
    const dbConnection = await db.getConnection()

    const [result] = await dbConnection.query(`
        SELECT 
            event_name, COUNT(*) AS event_count
        FROM
            events
        WHERE created_at BETWEEN ? AND ?
        GROUP BY event_name
        ORDER BY event_count DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    return result
}