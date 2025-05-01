const db = require('../database')

exports.getCountByName = async (offset, startDate, endDate) => {
    const [result] = await db.query(`
        SELECT 
            event_name, COUNT(*) AS event_count
        FROM
            events
        WHERE created_at BETWEEN ? AND ?
        GROUP BY event_name
        ORDER BY event_count DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    const [[total]] = await db.query(`
            SELECT COUNT(DISTINCT(event_name)) AS total
            FROM events
            WHERE created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { result, total }
}