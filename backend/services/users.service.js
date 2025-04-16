const db = require('../database')

module.exports.getUsersByCountry = async (offset, startDate, endDate) => {
    const dbConnection = await db.getConnection()

    const [result] = await dbConnection.query(`
        SELECT 
            country AS country,
            COUNT(DISTINCT (visitor_id)) AS users
        FROM
            sessions
        WHERE
            created_at BETWEEN ? AND ?
        GROUP BY country
        ORDER BY users DESC
        LIMIT 5 OFFSET ?;
        `, [startDate, endDate, offset])

    return result
}